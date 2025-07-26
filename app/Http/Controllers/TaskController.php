<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index()
    {
        return  Auth::user()->tasks()->latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'in:todo,in_progress,completed',
            'priority' => 'in:low,medium,high',
            'due_date' => 'nullable|date',
        ]);

        $task =  Auth::user()->tasks()->create($validated);

        return response()->json($task, 201);
    }

    public function show(Task $task)
    {
        $this->authorize('view', $task);
        return $task;
    }

    public function update(Request $request, Task $task)
    {
        $this->authorize('update', $task);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:todo,in_progress,completed',
            'priority' => 'sometimes|in:low,medium,high',
            'due_date' => 'nullable|date',
        ]);

        $task->update($validated);

        return response()->json($task);
    }

    public function destroy(Task $task)
    {
        $this->authorize('delete', $task);
        $task->delete();

        return response()->json(null, 204);
    }

    public function trashed()
    {
        return  Auth::user()->tasks()->onlyTrashed()->get();
    }

    public function restore($id)
    {
        $task =  Auth::user()->tasks()->onlyTrashed()->findOrFail($id);
        $task->restore();

        return response()->json($task);
    }

    public function forceDelete($id)
    {
        $task = Auth::user()->tasks()->onlyTrashed()->findOrFail($id);
        $task->forceDelete();

        return response()->json(null, 204);
    }
}
