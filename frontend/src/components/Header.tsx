import { useAuth } from '../contexts/AuthContext';
import '../App.css';

export default function Header() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm('ログアウトしますか？')) {
      logout();
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">📝 Todo App</h1>
        {user && (
          <div className="header-user">
            <span className="user-name">👤 {user.name}</span>
            <button
              className="btn-secondary btn-small"
              onClick={handleLogout}
            >
              ログアウト
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
