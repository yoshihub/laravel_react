import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../App.css';

// API URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// インターフェース
interface Todo {
  title: string;
  description: string | null;
  status: number;
  created_at: string;
  updated_at: string;
}

// コンポーネント
export default function TodoEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [todo, setTodo] = useState<Todo | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

  // Todo 取得
  const getTodo = useCallback(() => {
    axios.get(`${API_BASE_URL}/todos/${id}`)
      .then(res => {
        const data = res.data.data;
        setTodo({
          title: data.title,
          description: data.description,
          status: data.status,
          created_at: data.created_at,
          updated_at: data.updated_at,
        });
      })
      .catch(console.error);
  }, [API_BASE_URL, id]);

  // バリデーションチェック
  const validateTodo = (todo: { title: string; description?: string | null }) => {
    if (!todo.title) return 'タイトルを入力してください';
    if (todo.title.length > 255) return 'タイトルは255文字以内で入力してください';
    if (todo.description && todo.description.length > 255) return '説明は255文字以内で入力してください';
    return null;
  };

  // Todo 更新
  const updateTodo = () => {
    if (!todo) return;

    // バリデーションチェック
    const error = validateTodo(todo);
    if (error) {
      alert(error);
      return;
    }

    axios.put(`${API_BASE_URL}/todos/${id}`, todo)
      .then(() => navigate('/'))
      .catch((error) => {
        if (error.response?.status === 422) {
          setErrors(error.response.data.errors);
        } else {
          console.error(error);
        }
      });
  };

  useEffect(() => {
    getTodo();
  }, [getTodo]);

  // 読み込み中表示
  if (!todo) {
    return <div className="page-container">読み込み中...</div>;
  }

  return (
    <div className="page-container">
      <h1 className="section-title">✏️ Todo 編集</h1>

      <section className="form-section todo-form">
        <div className="form-group">
          <label>タイトル：</label>
          <input
            type="text"
            value={todo.title}
            onChange={e => setTodo({ ...todo, title: e.target.value })}
            className="input-text"
          />
          {errors.title && <div className="error-text">{errors.title.join(', ')}</div>}
        </div>

        <div className="form-group">
          <label>説明：</label>
          <textarea
            value={todo.description || ''}
            onChange={e => setTodo({ ...todo, description: e.target.value })}
            className="textarea-text"
          />
          {errors.description && <div className="error-text">{errors.description.join(', ')}</div>}
        </div>

        <div className="status-buttons">
          {[0, 1, 2].map(s => {
            const isActive = todo.status === s;
            return (
              <button
                key={s}
                onClick={() => setTodo({ ...todo, status: s })}
                className={`status-button ${
                  isActive
                    ? ['status-active-not-started', 'status-active-in-progress', 'status-active-done'][s]
                    : 'status-inactive'
                }`}
              >
                {['未着手', '進行中', '完了'][s]}
              </button>
            );
          })}
        </div>

        <div className="form-actions">
          <button className="btn-primary" onClick={updateTodo}>💾 保存</button>
          <button className="btn-secondary" onClick={() => navigate('/')}>戻る</button>
        </div>
      </section>
    </div>
  );
}
