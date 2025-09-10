<?php

namespace App\Services;

use App\Models\Todo;

class TodoService
{
    /**
     * TODO 一覧取得
     *
     * @return array
     */
    public function getList(): array
    {
        $todos = Todo::all();

        return [
            'status' => 'success',
            'data'   => $todos,
        ];
    }

    /**
     * TODO 取得
     *
     * @param int $todoId
     * @return array
     */
    public function getById(int $todoId): array
    {
        $todo = Todo::find($todoId);
        if (!$todo) {
            return [
                'status' => 'error',
                'message' => 'Todoリストが見つかりません。',
            ];
        }

        return [
            'status' => 'success',
            'data'   => $todo,
        ];
    }

    /**
     * TODO 新規作成
     *
     * @param array $param
     * @return array
     */
    public function create(array $param): array
    {
        $todos = Todo::create($param);

        return [
            'status' => 'success',
            'data'   => $todos,
        ];
    }

    /**
     * TODO 更新
     *
     * @param int $todoId
     * @param array $param
     * @return array
     */
    public function update(int $todoId, array $param): array
    {
        $todos = Todo::find($todoId);
        if (!$todos) {
            return [
                'status' => 'error',
                'message' => 'Todoリストが見つかりません。',
            ];
        }

        $todos->update($param);

        return [
            'status' => 'success',
            'data'   => $todos,
        ];
    }

    /**
     * TODO 削除
     *
     * @param int $todoId
     * @return array
     */
    public function delete(int $todoId): array
    {
        $todos = Todo::find($todoId);
        if (!$todos) {
            return [
                'status' => 'error',
                'message' => 'Todoリストが見つかりません。',
            ];
        }
        $todos->delete();

        return [
            'status' => 'success',
            'message' => 'Todoリストを削除しました。',
        ];
    }
}
