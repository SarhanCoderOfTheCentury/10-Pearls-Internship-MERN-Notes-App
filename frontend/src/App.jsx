import { Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NoteEditorPage from "./pages/NoteEditorPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage"
import AppLayout from "./components/AppLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Would navigate to dashboard if path is '/' root */}
      <Route
        path="/"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />
      {/* Public Pages */}
      <Route path='/register' element={<RegisterPage />} />
      <Route path='/login' element={<LoginPage />} />
      {/* Protected Application Pages */}
      {/* every application page would have to pass the Protected path element */}
      <Route element={<ProtectedRoute/>}> 
          <Route element={<AppLayout />}>
            <Route path='dashboard' element={<DashboardPage />} />
            <Route path='profile' element={<ProfilePage />} />
            <Route path='notes/new' element={<NoteEditorPage />} />
            <Route path='notes/:id/edit' element={<NoteEditorPage />} />
          </Route>
        </Route>
        {/* 404 Page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
  )
}

export default App
