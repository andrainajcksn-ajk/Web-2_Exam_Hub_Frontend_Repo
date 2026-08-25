import { Routes, Route, Navigate } from 'react-router-dom'

import ProtectedRoute from './auth/ProtectedRoute.jsx'
import RoleRoute from './auth/RoleRoute.jsx'

import AdminLayout from './components/layout/AdminLayout.jsx'
import StudentLayout from './components/layout/StudentLayout.jsx'

import LoginPage from './pages/LoginPage.jsx'

import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx'
import AdminStudentsPage from './pages/admin/AdminStudentsPage.jsx'
import AdminCoursesPage from './pages/admin/AdminCoursesPage.jsx'
import AdminExamsPage from './pages/admin/AdminExamsPage.jsx'
import AdminExamQuestionsPage from './pages/admin/AdminExamQuestionsPage.jsx'
import AdminExamResultsPage from './pages/admin/AdminExamResultsPage.jsx'

import StudentExamsPage from './pages/student/StudentExamsPage.jsx'
import StudentExamTakePage from './pages/student/StudentExamTakePage.jsx'
import StudentExamResultPage from './pages/student/StudentExamResultPage.jsx'
import StudentResultsHistoryPage from './pages/student/StudentResultsHistoryPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute role="admin" />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/students" element={<AdminStudentsPage />} />
            <Route path="/admin/courses" element={<AdminCoursesPage />} />
            <Route path="/admin/exams" element={<AdminExamsPage />} />
            <Route path="/admin/exams/:id/questions" element={<AdminExamQuestionsPage />} />
            <Route path="/admin/exams/:id/results" element={<AdminExamResultsPage />} />
          </Route>
        </Route>

        <Route element={<RoleRoute role="student" />}>
          <Route element={<StudentLayout />}>
            <Route path="/student" element={<StudentExamsPage />} />
            <Route path="/student/exams/:id" element={<StudentExamTakePage />} />
            <Route path="/student/exams/:id/result" element={<StudentExamResultPage />} />
            <Route path="/student/results" element={<StudentResultsHistoryPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}