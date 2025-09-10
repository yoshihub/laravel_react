<?php

namespace App\Http\Controllers;

use App\Services\TodoService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;


class TodoController extends Controller
{
    protected TodoService $todoService;

    public function __construct(TodoService $todoService)
    {
        $this->todoService = $todoService;
    }

    /**
     * Todo 一覧取得
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $todos = $this->todoService->getList();

        return response()->json(
            $todos,
            Response::HTTP_OK,
            [],
            JSON_UNESCAPED_UNICODE
        );
    }

    /**
     * Todo 取得
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function show(Request $request): JsonResponse
    {
        $request->merge([
            'todoId' => $request->route('todoId'),
        ]);

        $param = $request->validate([
            'todoId' => 'required|integer',
        ]);
        $todoId = $param['todoId'];
        $todo = $this->todoService->getById($todoId);

        return response()->json(
            $todo,
            Response::HTTP_OK,
            [],
            JSON_UNESCAPED_UNICODE
        );
    }

    /**
     * Todo 新規作成
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $param = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
            'status' => 'nullable|integer',
        ]);
        $todo = $this->todoService->create($param);

        return response()->json(
            $todo,
            Response::HTTP_CREATED,
            [],
            JSON_UNESCAPED_UNICODE
        );
    }

    /**
     * Todo 更新
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function update(Request $request): JsonResponse
    {
        $request->merge([
            'todoId' => $request->route('todoId'),
        ]);

        $param = $request->validate([
            'todoId' => 'required|integer',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
            'status' => 'required|integer',
        ]);
        $todoId = $param['todoId'];

        $todo = $this->todoService->update($todoId, $param);

        return response()->json(
            $todo,
            Response::HTTP_OK,
            [],
            JSON_UNESCAPED_UNICODE
        );
    }

    /**
     * Todo 削除
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function destroy(Request $request): JsonResponse
    {
        $request->merge([
            'todoId' => $request->route('todoId'),
        ]);

        $param = $request->validate([
            'todoId' => 'required|integer',
        ]);
        $todoId = $param['todoId'];

        $todo = $this->todoService->delete($todoId);

        return response()->json(
            $todo,
            Response::HTTP_OK,
            [],
            JSON_UNESCAPED_UNICODE
        );
    }
}
