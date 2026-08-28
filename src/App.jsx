import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
import ProtectedRoute from './components/common/protectedRoute';
import AuthLayout from './components/layout/authLayout';
import AdminLayout from './components/layout/adminLayout';
import StudentLayout from './components/layout/studentLayout';
import Login from './pages/login';
import Dashboard from './pages/admin/dashboard';
import Students from './pages/admin/students';
import Courses from './pages/admin/courses';
import Exams from './pages/admin/exams';
import ExamQuestions from './pages/admin/examQuestion';
import ExamResults from './pages/admin/examResults';
import AvailableExams from './pages/student/availableExams';
import TakeExam from './pages/student/takeExam';
import ExamResult from './pages/student/examResult';
import MyResults from './pages/student/myResults';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<AuthLayout />}>
            <Route index element={<Login />} />
          </Route>

          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="students" element={<Students />} />
            <Route path="courses" element={<Courses />} />
            <Route path="exams" element={<Exams />} />
            <Route path="exams/:id/questions" element={<ExamQuestions />} />
            <Route path="exams/:id/results" element={<ExamResults />} />
          </Route>

          <Route
            path="/student"
            element={
              <ProtectedRoute role="student">
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AvailableExams />} />
            <Route path="exams/:id" element={<TakeExam />} />
            <Route path="exams/:id/result" element={<ExamResult />} />
            <Route path="results" element={<MyResults />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
