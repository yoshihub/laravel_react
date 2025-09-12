import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import TodoList from './pages/TodoList';
import TodoEdit from './pages/TodoEdit';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ログインページ */}
          <Route path="/login" element={<Login />} />

          {/* 認証が必要なページ */}
          <Route path="/" element={
            <ProtectedRoute>
              <TodoList />
            </ProtectedRoute>
          } />
          <Route path="/edit/:id" element={
            <ProtectedRoute>
              <TodoEdit />
            </ProtectedRoute>
          } />

          {/* その他のパスはトップページにリダイレクト */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
