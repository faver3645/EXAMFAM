import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import HomePage from './home/HomePage';
import QuizListPage from './quiz/QuizListPage';
import QuizCreatePage from './quiz/QuizCreatePage'; //
import NavMenu from './shared/NavMenu';
import './App.css';

function App() {
  return (
    <Router> 
      <NavMenu />
      <Container>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/quiz" element={<QuizListPage />} />
          <Route path="/quizcreate" element={<QuizCreatePage />} /> 
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;