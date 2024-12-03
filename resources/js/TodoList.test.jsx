import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import TodoList from './components/TodoList';

jest.mock('axios');

describe('TodoList Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders loading state', () => {
        render(<TodoList />);
        expect(screen.getByText(/loading tasks.../i)).toBeInTheDocument();
    });

    test('renders tasks after fetching', async () => {
        const tasks = [
            { id: 1, title: 'Test Task 1', completed: false },
            { id: 2, title: 'Test Task 2', completed: true },
        ];
        axios.get.mockResolvedValueOnce({ data: tasks });

        render(<TodoList />);

        await waitFor(() => expect(screen.queryByText(/loading tasks.../i)).not.toBeInTheDocument());
        expect(screen.getByText('Test Task 1')).toBeInTheDocument();
        expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    });

    test('adds a new task', async () => {
        const tasks = [];
        axios.get.mockResolvedValueOnce({ data: tasks });
        axios.post.mockResolvedValueOnce({ data: { id: 3, title: 'New Task', completed: false } });

        render(<TodoList />);

        await waitFor(() => expect(screen.queryByText(/loading tasks.../i)).not.toBeInTheDocument());

        fireEvent.change(screen.getByPlaceholderText(/add a new task/i), {
            target: { value: 'New Task' }
        });
        fireEvent.click(screen.getByText(/add/i));

        expect(await screen.findByText('New Task')).toBeInTheDocument();
    });

    test('toggles a task', async () => {
        const tasks = [{ id: 1, title: 'Test Task', completed: false }];
        axios.get.mockResolvedValueOnce({ data: tasks });
        axios.put.mockResolvedValueOnce({ data: { id: 1, title: 'Test Task', completed: true } });

        render(<TodoList />);

        await waitFor(() => expect(screen.queryByText(/loading tasks.../i)).not.toBeInTheDocument());

        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);

        expect(checkbox).toBeChecked();
    });

    test('deletes a task', async () => {
        const tasks = [{ id: 1, title: 'Test Task', completed: false }];
        axios.get.mockResolvedValueOnce({ data: tasks });
        axios.delete.mockResolvedValueOnce({});

        render(<TodoList />);

        await waitFor(() => expect(screen.queryByText(/loading tasks.../i)).not.toBeInTheDocument());

        fireEvent.click(screen.getByLabelText(/delete task "Test Task"/i));

        expect(await screen.queryByText('Test Task')).not.toBeInTheDocument();
    });

    test('displays error message when fetching fails', async () => {
        axios.get.mockRejectedValueOnce(new Error('Fetch error'));

        render(<TodoList />);

        await waitFor(() => expect(screen.getByText(/failed to fetch tasks/i)).toBeInTheDocument());
    });

    test('displays error message when adding fails', async () => {
        const tasks = [];
        axios.get.mockResolvedValueOnce({ data: tasks });
        axios.post.mockRejectedValueOnce(new Error('Add task error'));

        render(<TodoList />);

        await waitFor(() => expect(screen.queryByText(/loading tasks.../i)).not.toBeInTheDocument());

        fireEvent.change(screen.getByPlaceholderText(/add a new task/i), {
            target: { value: 'New Task' }
        });
        fireEvent.click(screen.getByText(/add/i));

        expect(await screen.findByText(/failed to add task/i)).toBeInTheDocument();
    });
});