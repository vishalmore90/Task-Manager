import { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = 'task_manager_auth_user';
const USERS_STORAGE_KEY = 'task_manager_registered_users';

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
    // Ignore storage quota errors
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
      if (!email || !String(email).trim()) {
        throw new Error('Email address is required');
      }
      if (!password || String(password).length < 4) {
        throw new Error('Password must be at least 4 characters');
      }
      const normalizedEmail = String(email).trim().toLowerCase();
      const displayName =
        name && String(name).trim()
          ? String(name).trim()
          : normalizedEmail.split('@')[0];

      const userRecord = {
        id: `user_${Date.now()}`,
        name: displayName,
        email: normalizedEmail,
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

  const login = (formData) => {
    const email = String(formData?.email || '').trim().toLowerCase();
    const password = String(formData?.password || '');
    const customName = String(formData?.name || '').trim();

    if (!email) {
      return { success: false, message: 'Email is required' };
    }
    if (!password) {
      return { success: false, message: 'Password is required' };
    }

    const existingUser = registeredUsers.find(
      (item) => item.email.toLowerCase() === email
    );

    const resolvedName =
      customName || existingUser?.name || email.split('@')[0] || 'User';

    const sessionUser = {
      id: existingUser?.id || `usr_${Date.now()}`,
      name: resolvedName,
      email,
      role: 'Workspace Member',
      loggedInAt: new Date().toISOString(),
    };

    if (!existingUser) {
      setRegisteredUsers((prev) => [
        ...prev,
        { ...sessionUser, passwordHash: btoa(password) },
      ]);
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
    const updated = { ...user, ...updates };
    setUser(updated);
    return updated;
  };

  const value = {
    user,
    isAuthenticated: Boolean(user && user.email),
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
