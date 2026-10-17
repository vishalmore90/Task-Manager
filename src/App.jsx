import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import AllTasks from './pages/AllTasks.jsx';
import AddTask from './pages/AddTask.jsx';
import Profile from './pages/Profile.jsx';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Login />} />

          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <AllTasks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/all-tasks"
            element={
              <ProtectedRoute>
                <AllTasks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-task"
            element={
              <ProtectedRoute>
                <AddTask />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-task/:id"
            element={
              <ProtectedRoute>
                <AddTask />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
