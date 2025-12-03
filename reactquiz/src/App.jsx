import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// pages
import HomePage from "./home/HomePage";
import QuizListPage from "./quiz/QuizListPage";
import QuizCreatePage from "./quiz/QuizCreatePage";
import QuizDetailPage from "./quiz/QuizDetailPage";
import QuizUpdatePage from "./quiz/QuizUpdatePage";
import ListQuizPage from "./takequiz/ListQuizPage";
import TakeQuizPage from "./takequiz/TakeQuizPage";
import ResultPage from "./takequiz/ResultPage";
import AttemptsPage from "./takequiz/AttemptsPage";
import ViewAttemptResultPage from "./takequiz/ViewAttemptResultPage";
import TeacherDashboard from "./takequiz/TeacherDashboard";

import AboutPage from "./shared/AboutPage";
import ContactPage from "./shared/ContactPage";
import HelpPage from "./shared/HelpPage";
import NavMenu from "./shared/NavMenu";
import Footer from "./shared/Footer";

// Auth
import { AuthProvider } from "./auth/AuthProvider";
import ProtectedRoute from "./auth/ProtectedRoute";
import LoginPage from "./auth/LoginPage";
import RegisterPage from "./auth/RegisterPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <NavMenu />

          <Container className="flex-fill py-4">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/quiz" element={<QuizListPage />} />

              {/* Auth routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected routes for Teacher */}
              <Route element={<ProtectedRoute allowedRoles={["Teacher"]} />}>
                <Route path="/quizcreate" element={<QuizCreatePage />} />
                <Route path="/quizdetails/:quizId" element={<QuizDetailPage />} />
                <Route path="/quizupdate/:quizId" element={<QuizUpdatePage />} />
                 <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
              </Route>

              {/* Protected routes for Student */}
              <Route element={<ProtectedRoute allowedRoles={["Student"]} />}>
                <Route path="/takequiz" element={<ListQuizPage />} />
                <Route path="/takequiz/take/:quizId" element={<TakeQuizPage />} />
                <Route path="/takequiz/result/:quizId" element={<ResultPage />} />
              </Route>

              {/* Protected route for both Teacher and Student */}
              <Route element={<ProtectedRoute allowedRoles={["Teacher", "Student"]} />}>
                <Route path="/takequiz/:quizId/attempts" element={<AttemptsPage />} />
                <Route path="/takequiz/attempt/:attemptId" element={<ViewAttemptResultPage />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Container>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
