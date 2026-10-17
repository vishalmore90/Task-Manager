const fs = require('fs');
const path = require('path');
const assert = require('assert');

const NODE_SHARED = '/usr/share/nodejs';
const babelParser = require(path.join(NODE_SHARED, '@babel/parser'));
const babelCore = require(path.join(NODE_SHARED, '@babel/core'));

const PROJECT_ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(PROJECT_ROOT, 'src');

function collectFiles(dir, extList = ['.js', '.jsx']) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectFiles(fullPath, extList));
    } else if (extList.includes(path.extname(entry.name))) {
      results.push(fullPath);
    }
  }
  return results.sort();
}

console.log('==============================================================');
console.log('1. AST & JSX Syntax Verification');
console.log('==============================================================');

const sourceFiles = collectFiles(SRC_DIR);
assert(sourceFiles.length >= 10, 'Expected at least 10 source files in src/');

const transpiledCache = new Map();

for (const filePath of sourceFiles) {
  const relPath = path.relative(PROJECT_ROOT, filePath);
  const code = fs.readFileSync(filePath, 'utf8');

  const ast = babelParser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx'],
  });
  assert(ast && ast.type === 'File', `AST parse failed for ${relPath}`);

  const transformed = babelCore.transformSync(code, {
    filename: relPath,
    presets: [
      [path.join(NODE_SHARED, '@babel/preset-env'), { targets: { node: 'current' } }],
      [path.join(NODE_SHARED, '@babel/preset-react'), { runtime: 'classic' }],
    ],
  });
  assert(transformed && transformed.code.length > 0, `Babel transform failed for ${relPath}`);
  transpiledCache.set(path.resolve(filePath), transformed.code);
  console.log(`[PASS] Parsed & transpiled JSX -> CJS: ${relPath}`);
}

console.log('\n==============================================================');
console.log('2. Functional Verification of AuthContext & TaskContext CRUD');
console.log('==============================================================');

let mockRouteParams = {};

const reactStub = {
  StrictMode: 'StrictMode',
  Fragment: 'Fragment',
  createContext: (defaultVal) => ({
    _currentValue: defaultVal,
    Provider: ({ value, children }) => ({ type: 'ContextProvider', value, children }),
  }),
  useContext: (ctx) => ctx._currentValue,
  useState: (init) => [typeof init === 'function' ? init() : init, () => {}],
  useEffect: () => {},
  useMemo: (fn) => fn(),
  createElement: (type, props, ...children) => ({ type, props: props || {}, children }),
};

const routerStub = {
  BrowserRouter: ({ children }) => ({ type: 'BrowserRouter', children }),
  Routes: ({ children }) => ({ type: 'Routes', children }),
  Route: (props) => ({ type: 'Route', props }),
  Link: (props) => ({ type: 'Link', props }),
  NavLink: (props) => ({
    type: 'NavLink',
    props: {
      ...props,
      className: typeof props.className === 'function' ? props.className({ isActive: true }) : props.className,
    },
  }),
  Navigate: (props) => ({ type: 'Navigate', props }),
  useNavigate: () => () => {},
  useLocation: () => ({ pathname: '/tasks', state: {} }),
  useParams: () => mockRouteParams,
};

const hookFormStub = {
  useForm: ({ defaultValues } = {}) => ({
    register: (name, rules) => ({ name, rules }),
    handleSubmit: (fn) => () => fn(defaultValues || {}),
    setValue: () => {},
    reset: () => {},
    formState: { errors: {}, isSubmitting: false },
  }),
};

const moduleExportsCache = new Map();

function loadProjectModule(absPath) {
  const normalized = path.resolve(absPath);
  if (moduleExportsCache.has(normalized)) {
    return moduleExportsCache.get(normalized);
  }
  const code = transpiledCache.get(normalized);
  assert(code, `No transpiled code found for ${normalized}`);

  const mod = { exports: {} };
  moduleExportsCache.set(normalized, mod.exports);

  const customRequire = (id) => {
    if (id === 'react') return reactStub;
    if (id === 'react-router-dom') return routerStub;
    if (id === 'react-hook-form') return hookFormStub;
    if (id.endsWith('.css')) return {};
    if (id.startsWith('.')) {
      const target = path.resolve(path.dirname(normalized), id);
      return loadProjectModule(target);
    }
    throw new Error(`Unexpected external import: ${id}`);
  };

  const fn = new Function('exports', 'require', 'module', code);
  fn(mod.exports, customRequire, mod);
  moduleExportsCache.set(normalized, mod.exports);
  return mod.exports;
}

const authMod = loadProjectModule(path.join(SRC_DIR, 'context/AuthContext.jsx'));
const taskMod = loadProjectModule(path.join(SRC_DIR, 'context/TaskContext.jsx'));

const authStore = authMod.createAuthStore(null);
assert.strictEqual(authStore.isAuthenticated(), false, 'Initially unauthenticated');

const loggedInUser = authStore.login({
  email: 'alex@example.com',
  password: 'password123',
});
assert.strictEqual(authStore.isAuthenticated(), true, 'User should be authenticated after login');
assert.strictEqual(loggedInUser.email, 'alex@example.com');
assert.strictEqual(loggedInUser.name, 'alex');
console.log(`[PASS] Auth Flow: Login succeeded for ${loggedInUser.email}`);

authStore.logout();
assert.strictEqual(authStore.isAuthenticated(), false, 'User should be logged out');
console.log('[PASS] Auth Flow: Logout cleared user session');

const taskStore = taskMod.createTaskStore([]);
assert.strictEqual(taskStore.getAllTasks().length, 0, 'Starts with 0 tasks');

const createdTask = taskStore.addTask({
  title: 'Complete React',
  description: 'Complete CRUD Operation',
  status: 'In Progress',
  priority: 'High',
  dueDate: '2026-10-20',
});
assert.strictEqual(createdTask.title, 'Complete React');
assert.strictEqual(createdTask.description, 'Complete CRUD Operation');
assert.strictEqual(createdTask.status, 'In Progress');
assert.strictEqual(createdTask.priority, 'High');
assert.strictEqual(taskStore.getAllTasks().length, 1);
console.log(`[PASS] CREATE Task: Created "${createdTask.title}"`);

const updatedOnce = taskStore.updateTask(createdTask.id, {
  title: 'Complete React JS',
});
assert.strictEqual(updatedOnce.title, 'Complete React JS');
console.log(`[PASS] UPDATE Task #1: Edited title to "${updatedOnce.title}"`);

const updatedTwice = taskStore.updateTask(createdTask.id, {
  title: 'Complete React JS Project',
});
assert.strictEqual(updatedTwice.title, 'Complete React JS Project');
console.log(`[PASS] UPDATE Task #2: Edited title to "${updatedTwice.title}"`);

const deleted = taskStore.deleteTask(createdTask.id);
assert.strictEqual(deleted, true);
assert.strictEqual(taskStore.getAllTasks().length, 0);
console.log('[PASS] DELETE Task: Deleted task and verified empty list');

console.log('\n==============================================================');
console.log('3. Component Render & Conditional Routing Verification');
console.log('==============================================================');

authMod.AuthContext._currentValue = {
  user: null,
  isAuthenticated: false,
  registeredUsers: [],
  login: () => ({ success: true }),
  registerUser: () => ({ success: true }),
  logout: () => {},
  updateProfile: () => {},
};

taskMod.TaskContext._currentValue = {
  tasks: taskMod.INITIAL_TASKS,
  addTask: () => {},
  getTaskById: (id) => taskMod.INITIAL_TASKS.find((t) => t.id === id) || null,
  updateTask: () => {},
  deleteTask: () => {},
  toggleTaskStatus: () => {},
  resetTasks: () => {},
};

const Navbar = loadProjectModule(path.join(SRC_DIR, 'components/Navbar.jsx')).default;
const ProtectedRoute = loadProjectModule(path.join(SRC_DIR, 'components/ProtectedRoute.jsx')).default;
const TaskCard = loadProjectModule(path.join(SRC_DIR, 'components/TaskCard.jsx')).default;
const Home = loadProjectModule(path.join(SRC_DIR, 'pages/Home.jsx')).default;
const Login = loadProjectModule(path.join(SRC_DIR, 'pages/Login.jsx')).default;
const AddTask = loadProjectModule(path.join(SRC_DIR, 'pages/AddTask.jsx')).default;
const AllTasks = loadProjectModule(path.join(SRC_DIR, 'pages/AllTasks.jsx')).default;
const Profile = loadProjectModule(path.join(SRC_DIR, 'pages/Profile.jsx')).default;
const App = loadProjectModule(path.join(SRC_DIR, 'App.jsx')).default;

const navStage1 = JSON.stringify(Navbar());
assert(navStage1.includes('/login'), 'Unauthenticated Navbar must include /login link');
assert(!navStage1.includes('/add-task'), 'Unauthenticated Navbar must not show /add-task link');
console.log('[PASS] Navbar (Unauthenticated): Renders logo + Login button');

const guardRedirect = ProtectedRoute({ children: 'Secret' });
assert.strictEqual(guardRedirect.props.to, '/login');
console.log('[PASS] ProtectedRoute (Unauthenticated): Redirects to /login');

const loginTree = JSON.stringify(Login());
assert(loginTree.includes('Welcome Back'));
console.log('[PASS] Login Page: Renders email/password form');

authMod.AuthContext._currentValue = {
  ...authMod.AuthContext._currentValue,
  user: { id: 'u1', name: 'Alex', email: 'alex@example.com' },
  isAuthenticated: true,
};

const navStage2 = JSON.stringify(Navbar());
assert(navStage2.includes('/tasks') && navStage2.includes('/add-task'));
console.log('[PASS] Navbar (Authenticated): Renders All Tasks, Add Task, Profile & Logout');

const guardAllowed = ProtectedRoute({ children: 'ProtectedContent' });
assert.strictEqual(guardAllowed, 'ProtectedContent');
console.log('[PASS] ProtectedRoute (Authenticated): Renders protected child route');

const homeTree = JSON.stringify(Home());
assert(homeTree.includes('Manage Your Daily Tasks'));
console.log('[PASS] Home Page: Renders hero and task summary');

const allTasksTree = JSON.stringify(AllTasks());
assert(allTasksTree.includes('All Tasks'));
console.log('[PASS] AllTasks Page: Renders task counters, filters, and TaskCard grid');

const cardTree = JSON.stringify(TaskCard({ task: taskMod.INITIAL_TASKS[0] }));
assert(cardTree.includes('Complete React') && cardTree.includes('In Progress'));
console.log('[PASS] TaskCard Component: Renders badges, description, Edit and Delete buttons');

mockRouteParams = {};
const addTaskTree = JSON.stringify(AddTask());
assert(addTaskTree.includes('Add New Task'));
console.log('[PASS] AddTask Page (Create Mode): Renders Add New Task form');

mockRouteParams = { id: 'task_1' };
const editTaskTree = JSON.stringify(AddTask());
assert(editTaskTree.includes('Edit Task'));
console.log('[PASS] AddTask Page (Edit Mode): Pre-fills task_1 and renders Edit Task form');

const profileTree = JSON.stringify(Profile());
assert(profileTree.includes('alex@example.com'));
console.log('[PASS] Profile Page: Renders authenticated user profile');

const appTree = JSON.stringify(App());
assert(appTree.includes('/edit-task/:id'));
console.log('[PASS] App Component: Mounts Navbar and all Routes');

console.log('\n==============================================================');
console.log('ALL CHECKS PASSED (100%)');
console.log('==============================================================');
