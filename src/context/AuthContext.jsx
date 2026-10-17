import { createContext, useContext, useState, useEffect } from 'react';
import { sanitizeText, sanitizeEmail } from '../utils/sanitize.js';
import { hashPassword } from '../utils/crypto.js';

export const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = 'task_manager_auth_user';
const USERS_STORAGE_KEY = 'task_manager_registered_users';
const RATE_LIMIT_STORAGE_KEY = 'task_manager_auth_rate_limit';

function readStorageJSON(key, fallback) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return fallback;
    }
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorageJSON(key, value) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (value === null || value === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    }
  } catch {
    // Storage quota fallback
  }
}

export function createAuthStore(initialUser = null) {
  let currentUser = initialUser;
  const listeners = new Set();

  const notify = () => {
    listeners.forEach((listener) => listener(currentUser));
  };

  return {
    getUser: () => currentUser,
    isAuthenticated: () => Boolean(currentUser && currentUser.email),
    login: ({ email, password, name }) => {
      const sanitizedEmail = sanitizeEmail(email);
      if (!sanitizedEmail) {
        throw new Error('Email address is required');
      }
      if (!password || String(password).length < 4) {
        throw new Error('Password must be at least 4 characters');
      }
      const displayName = name ? sanitizeText(name, 50) : sanitizedEmail.split('@')[0];

      const userRecord = {
        id: `user_${Date.now()}`,
        name: displayName,
        email: sanitizedEmail,
        role: 'Workspace Member',
        loggedInAt: new Date().toISOString(),
      };
      currentUser = userRecord;
      notify();
      return userRecord;
    },
    logout: () => {
      currentUser = null;
      notify();
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStorageJSON(AUTH_STORAGE_KEY, null));
  const [registeredUsers, setRegisteredUsers] = useState(() =>
    readStorageJSON(USERS_STORAGE_KEY, [])
  );

  useEffect(() => {
    writeStorageJSON(AUTH_STORAGE_KEY, user);
  }, [user]);

  useEffect(() => {
    writeStorageJSON(USERS_STORAGE_KEY, registeredUsers);
  }, [registeredUsers]);

  // Client-side rate-limiting helper
  const checkRateLimit = (email) => {
    const rateData = readStorageJSON(RATE_LIMIT_STORAGE_KEY, {});
    const now = Date.now();
    const userAttempts = rateData[email] || { count: 0, lockUntil: 0 };

    if (userAttempts.lockUntil && now < userAttempts.lockUntil) {
      const waitSeconds = Math.ceil((userAttempts.lockUntil - now) / 1000);
      return { allowed: false, message: `Too many attempts. Please wait ${waitSeconds}s.` };
    }
    return { allowed: true };
  };

  const recordFailedAttempt = (email) => {
    const rateData = readStorageJSON(RATE_LIMIT_STORAGE_KEY, {});
    const now = Date.now();
    const userAttempts = rateData[email] || { count: 0, lockUntil: 0 };
    const newCount = userAttempts.count + 1;

    if (newCount >= 5) {
      rateData[email] = { count: 0, lockUntil: now + 30000 }; // 30s lockout
    } else {
      rateData[email] = { count: newCount, lockUntil: 0 };
    }
    writeStorageJSON(RATE_LIMIT_STORAGE_KEY, rateData);
  };

  const clearRateLimit = (email) => {
    const rateData = readStorageJSON(RATE_LIMIT_STORAGE_KEY, {});
    delete rateData[email];
    writeStorageJSON(RATE_LIMIT_STORAGE_KEY, rateData);
  };

  const login = async (formData) => {
    const email = sanitizeEmail(formData?.email);
    const password = String(formData?.password || '');
    const customName = sanitizeText(formData?.name || '', 60);

    if (!email) {
      return { success: false, message: 'Valid email is required.' };
    }
    if (!password || password.length < 4) {
      return { success: false, message: 'Password must be at least 4 characters.' };
    }

    const rateCheck = checkRateLimit(email);
    if (!rateCheck.allowed) {
      return { success: false, message: rateCheck.message };
    }

    const passwordHash = await hashPassword(password);
    const existingUser = registeredUsers.find((item) => item.email.toLowerCase() === email);

    if (existingUser) {
      // Validate password hash
      if (existingUser.passwordHash && existingUser.passwordHash !== passwordHash) {
        recordFailedAttempt(email);
        return { success: false, message: 'Invalid credentials. Please verify your password.' };
      }
    }

    clearRateLimit(email);

    const resolvedName = customName || existingUser?.name || email.split('@')[0] || 'Member';
    const isFirstUser = registeredUsers.length === 0;

    const sessionUser = {
      id: existingUser?.id || `usr_${Date.now()}`,
      name: resolvedName,
      email,
      role: existingUser?.role || (isFirstUser ? 'Workspace Admin' : 'Workspace Member'),
      loggedInAt: new Date().toISOString(),
    };

    if (!existingUser) {
      setRegisteredUsers((prev) => [
        ...prev,
        { ...sessionUser, passwordHash },
      ]);
    } else if (!existingUser.passwordHash) {
      // Upgrade existing record to secure hash
      setRegisteredUsers((prev) =>
        prev.map((u) => (u.id === existingUser.id ? { ...u, passwordHash } : u))
      );
    }

    setUser(sessionUser);
    return { success: true, user: sessionUser };
  };

  const registerUser = (formData) => {
    return login(formData);
  };

  const logout = () => {
    setUser(null);
    writeStorageJSON(AUTH_STORAGE_KEY, null);
  };

  const updateProfile = (updates) => {
    if (!user) return null;
    const sanitizedName = updates.name ? sanitizeText(updates.name, 60) : user.name;
    const updated = { ...user, ...updates, name: sanitizedName };
    setUser(updated);
    setRegisteredUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, ...updates, name: sanitizedName } : u))
    );
    return updated;
  };

  const value = {
    user,
    isAuthenticated: Boolean(user && user.email),
    isAdmin: user?.role === 'Workspace Admin',
    registeredUsers,
    login,
    registerUser,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
