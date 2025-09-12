import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../App.css';

export default function Login() {
  const { login, register, user } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 認証済みの場合はホームページにリダイレクト
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  // 認証済みの場合は読み込み中表示
  if (user) {
    return (
      <div className="page-container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          ログイン中...
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    console.log('Form submitted:', { isLogin, formData });

    try {
      if (isLogin) {
        console.log('Attempting login...');
        await login(formData.email, formData.password);
        console.log('Login successful');
      } else {
        console.log('Attempting register...');
        await register(formData.name, formData.email, formData.password);
        console.log('Register successful');
      }

      // 認証成功後、少し遅延してからリダイレクト
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 100);
    } catch (error) {
      console.error('Auth error:', error);
      setError(error instanceof Error ? error.message : 'エラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="page-container">
      <div className="auth-container">
        <h1 className="section-title">
          {isLogin ? '🔐 ログイン' : '📝 ユーザー登録'}
        </h1>

        <form onSubmit={handleSubmit} className="form-section" autoComplete="off">
          {/* Chromeのパスワードマネージャーを完全に無効化するための隠しフィールド */}
          <input type="text" style={{ display: 'none' }} autoComplete="username" />
          <input type="password" style={{ display: 'none' }} autoComplete="current-password" />

          {!isLogin && (
            <div className="form-group">
              <label>お名前：</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="input-text"
                required={!isLogin}
                disabled={isLoading}
                autoComplete="off"
              />
            </div>
          )}

          <div className="form-group">
            <label>メールアドレス：</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="input-text"
              required
              disabled={isLoading}
              autoComplete="off"
            />
          </div>

          <div className="form-group">
            <label>パスワード：</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="input-text"
              required
              disabled={isLoading}
              minLength={8}
              autoComplete="new-password"
            />
          </div>

          {error && (
            <div className="error-text" style={{ marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? '処理中...' : (isLogin ? 'ログイン' : 'ユーザー登録')}
            </button>
          </div>
        </form>

        <div className="auth-switch">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setFormData({ name: '', email: '', password: '' });
            }}
            disabled={isLoading}
          >
            {isLogin ? 'ユーザー登録はこちら' : 'ログインはこちら'}
          </button>
        </div>
      </div>
    </div>
  );
}
