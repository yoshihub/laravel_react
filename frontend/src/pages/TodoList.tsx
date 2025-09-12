import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../utils/axiosConfig';
import Header from '../components/Header';
import '../App.css';

// インターフェース
interface Todo {
  id: number;
  title: string;
  description: string | null;
  status: number;
  created_at: string;
  updated_at: string;
}

// コンポーネント
export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<{ title: string; description: string }>({ title: '', description: '' });
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

  // Todo 一覧取得
  const getTodos = useCallback(() => {
    apiClient.get('/todos')
      .then(res => {
        const todos = Array.isArray(res.data.data) ? res.data.data : [];
        setTodos(todos);
      })
      .catch(console.error);
  }, []);

  // バリデーションチェック
  const validateTodo = (todo: { title: string; description?: string | null }) => {
    if (!todo.title) return 'タイトルを入力してください';
    if (todo.title.length > 255) return 'タイトルは255文字以内で入力してください';
    if (todo.description && todo.description.length > 255) return '説明は255文字以内で入力してください';
    return null;
  };

  // Todo 作成
  const addTodo = () => {
    // バリデーションチェック
    const error = validateTodo(newTodo);
    if (error) {
      alert(error);
      return;
    }

    apiClient.post('/todos', {
      ...newTodo,
      status: 0,
    })
      .then(res => {
        if (res.status === 201) {
          setNewTodo({ title: '', description: '' });
          setErrors({});
          getTodos();
        }
      })
      .catch(error => {
        if (error.response?.status === 422) {
          setErrors(error.response.data.errors);
        } else {
          console.error(error);
        }
      });
  };

  // Todo ステータス更新
  const updateStatus = (id: number, status: number) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    apiClient.put(`/todos/${id}`, {
      title: todo.title,
      description: todo.description,
      status,
    })
      .then(getTodos)
      .catch(console.error);
  };

  // Todo 削除
  const deleteTodo = (id: number) => {
    if (window.confirm('本当に削除しますか？')) {
      apiClient.delete(`/todos/${id}`)
        .then(getTodos)
        .catch(console.error);
    }
  };

  useEffect(() => {
    getTodos();
  }, [getTodos]);

  return (
    <div>
      <Header />
      <div className="page-container">
        <h1 className="section-title">➕ Todo 作成</h1>

      <div className="form-section">
        <div className="form-group">
          <label>タイトル：</label>
          <input
            type="text"
            className="input-text"
            value={newTodo.title}
            onChange={e => setNewTodo({ ...newTodo, title: e.target.value })}
          />
          {errors.title && <div className="error-text">{errors.title.join(', ')}</div>}
        </div>

        <div className="form-group">
          <label>説明：</label>
          <textarea
            className="textarea-text"
            value={newTodo.description}
            onChange={e => setNewTodo({ ...newTodo, description: e.target.value })}
          />
          {errors.description && <div className="error-text">{errors.description.join(', ')}</div>}
        </div>

        <div className="form-group">
          <button className="btn-primary" onClick={addTodo}>➕ Todo 作成</button>
        </div>
      </div>

      <hr />

      <h1 className="section-title">📋 Todo 一覧</h1>

      {!todos.length && <p>Todoがありません。</p>}

      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo.id} className="todo-card">
            <div className="todo-content">
              <p className="todo-title"><strong>{todo.title}</strong></p>
              <p className="todo-description">{todo.description}</p>

              <div className="date-info">
                <span>作成日: {new Date(todo.created_at).toLocaleString()}</span>
                <span>更新日: {new Date(todo.updated_at).toLocaleString()}</span>
              </div>

              <div className="status-buttons">
                {[0, 1, 2].map(s => {
                  const isActive = todo.status == s;
                  return (
                    <button
                      key={s}
                      onClick={() => updateStatus(todo.id, s)}
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
            </div>

            <div className="todo-actions">
              <Link to={`/edit/${todo.id}`}>
                <button className="btn-secondary">✏️ 編集</button>
              </Link>
              <button className="btn-secondary" onClick={() => deleteTodo(todo.id)}>🗑️ 削除</button>
            </div>
          </li>
        ))}
      </ul>
      </div>
    </div>
  );
}
