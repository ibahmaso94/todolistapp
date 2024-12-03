import './bootstrap';
import React from 'react';
import ReactDOM from 'react-dom/client';
import TodoList from './components/TodoList';

const App = () => (
    <React.StrictMode>
        <TodoList />
    </React.StrictMode>
);

const rootElement = document.getElementById('app');
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(<App />);
} else {
    console.error('Failed to find the root element');
}
