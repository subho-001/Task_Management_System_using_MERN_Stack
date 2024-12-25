import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../CSS/EditTask.css'; // Ensure the correct path to your CSS file

function EditTaskForm() {
    const { taskId } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState({ title: '', description: '', dueDate: '', priority: 'Medium' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true); 

    const fetchTask = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get(`http://localhost:5000/api/tasks/${taskId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTask(response.data.task);
            setLoading(false); // Set loading to false after data is fetched
        } catch (error) {
            console.error('Error fetching task:', error);
            setError('Error fetching task');
            setLoading(false); // Set loading to false even if there's an error
        }
    };

    useEffect(() => {
        fetchTask();
    }, [taskId]);

    const handleChange = (e) => {
        setTask({ ...task, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedTask = {
            title: task.title,
            description: task.description,
            dueDate: task.dueDate,
            priority: task.priority
        };

        const token = localStorage.getItem('token');

        try {
            const response = await axios.put(`http://localhost:5000/api/tasks/edit/${taskId}`, updatedTask, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status === 200) {
                alert('Task updated successfully');
                navigate(`/tasklist`);
            }
        } catch (error) {
            if (error.response && error.response.data) {
                alert(error.response.data.message);
            } else {
                console.error('Error updating Task:', error);
                alert('An unexpected error occurred. Please try again.');
            }
        }
    };

    const handleGoBack = () => {
      navigate('/tasklist');
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="container">
            <h1>Edit Task</h1>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit} className="task-form">
                <div className="form-group">
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={task.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={task.description}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="dueDate">Due Date:</label>
                    <input
                        type="date"
                        id="dueDate"
                        name="dueDate"
                        value={task.dueDate}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="priority">Priority:</label>
                    <select
                        id="priority"
                        name="priority"
                        value={task.priority}
                        onChange={handleChange}
                        required
                    >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>

                <button className="submit-button" type="submit">Save Changes</button>

                <button className="back_btn" onClick={handleGoBack}>Back to Task List</button>
            </form>
        </div>
    );
}

export default EditTaskForm;
