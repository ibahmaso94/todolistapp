import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TodoList = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('/api/tasks');
            setTasks(Array.isArray(response.data) ? response.data : []);
            setError(null);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            setError('Failed to fetch tasks. Please try again later.');
            setTasks([]);
        } finally {
            setIsLoading(false);
        }
    };

    const addTask = async (e) => {
        e.preventDefault();
        if (newTask.trim() === '') return;

        try {
            const response = await axios.post('/api/tasks', { title: newTask });
            setTasks(prevTasks => [response.data, ...prevTasks]);
            setNewTask('');
        } catch (error) {
            console.error('Error adding task:', error);
            setError('Failed to add task. Please try again.');
        }
    };

    const toggleTask = async (task) => {
        try {
            const response = await axios.put(`/api/tasks/${task.id}`, {
                ...task,
                completed: !task.completed,
            });
            setTasks(prevTasks => prevTasks.map(t => t.id === task.id ? response.data : t));
        } catch (error) {
            console.error('Error updating task:', error);
            setError('Failed to update task. Please try again.');
        }
    };

    const deleteTask = async (taskId) => {
        try {
            await axios.delete(`/api/tasks/${taskId}`);
            setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
        } catch (error) {
            console.error('Error deleting task:', error);
            setError('Failed to delete task. Please try again.');
        }
    };

    if (isLoading) {
        return <div className="text-center mt-10">Loading tasks...</div>;
    }

    if (error) {
        return <div className="text-center mt-10 text-red-500">{error}</div>;
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-4 text-center">To-Do List</h1>
            <form onSubmit={addTask} className="flex mb-4">
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Add a new task"
                    className="flex-grow mr-2 p-2 border rounded"
                    aria-label="New task"
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    aria-label="Add task"
                >
                    Add
                </button>
            </form>
            {tasks.length === 0 ? (
                <p className="text-center text-gray-500">No tasks yet. Add one above!</p>
            ) : (
                <ul className="space-y-2" aria-label="Task list">
                    {tasks.map(task => (
                        <li key={task.id} className="flex items-center justify-between p-2 border rounded">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => toggleTask(task)}
                                    className="mr-2"
                                    aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
                                />
                                <span className={task.completed ? 'line-through text-gray-500' : ''}>
                                    {task.title}
                                </span>
                            </div>
                            <button
                                onClick={() => deleteTask(task.id)}
                                className="text-red-500 hover:text-red-700"
                                aria-label={`Delete task "${task.title}"`}
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TodoList;
