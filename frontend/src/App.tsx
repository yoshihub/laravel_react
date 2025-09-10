import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TodoList from './pages/TodoList';
import TodoEdit from './pages/TodoEdit';

function App() {
  return (
    <Router>
      <Routes>
        {/* Todoリストのページ */}
        <Route path="/" element={<TodoList />} />
        {/* Todo編集のページ */}
        <Route path="/edit/:id" element={<TodoEdit />} />
      </Routes>
    </Router>
  );
}

export default App;
