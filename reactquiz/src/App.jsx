import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import HomePage from './home/HomePage';
import QuizListPage from './quiz/QuizListPage';
import QuizCreatePage from './quiz/QuizCreatePage';
import NavMenu from './shared/NavMenu';
import Footer from './shared/Footer'; 
import AboutPage from './shared/AboutPage';
import ContactPage from './shared/ContactPage';
import HelpPage from './shared/HelpPage';
import QuizDetailPage from "./quiz/QuizDetailPage";
import QuizUpdatePage from "./quiz/QuizUpdatePage";
import ListQuizPage from './takequiz/ListQuizPage';
import TakeQuizPage from './takequiz/TakeQuizPage';
import ResultPage from './takequiz/ResultPage';
import AttemptsPage from './takequiz/AttemptsPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        {/* 🔹 Global navigation bar */}
        <NavMenu />

        {/* 🔹 Main content container */}
        <Container className="flex-fill py-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/quiz" element={<QuizListPage />} />
            <Route path="/quizcreate" element={<QuizCreatePage />} />
            <Route path="/quizdetails/:quizId" element={<QuizDetailPage />} />
            <Route path="/quizupdate/:quizId" element={<QuizUpdatePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/help" element={<HelpPage />} /> 
            <Route path="/contact" element={<ContactPage />} />

            {/* 🔹 Take Quiz system */}
            <Route path="/takequiz" element={<ListQuizPage />} />
            <Route path="/takequiz/take/:quizId" element={<TakeQuizPage />} />
            <Route path="/takequiz/result/:quizId" element={<ResultPage />} />
            <Route path="/takequiz/:quizId/attempts" element={<AttemptsPage />} />



            {/* Redirect unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Container>

        {/* 🔹 Shared footer shown on every page */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
