import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../css/TaskDetails.module.css'; // Import CSS module

function TaskDetails() {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { taskId } = useParams();
  
  const navigate = useNavigate();

  const fetchTask = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTask(response.data.task);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch task details");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  const handleGoBack = () => {
    navigate('/tasklist');
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className={styles.container}>
      <h1>Task Details</h1>
      {task && (
        <div className={styles.taskDetails}>
          <h2>{task.title}</h2>
          <p><strong>Description:</strong> {task.description}</p>
          <p><strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
          <p><strong>Priority:</strong> {task.priority}</p>
          <p><strong>Status:</strong> {task.status}</p>
        </div>
      )}
      <button className={styles.back_btn} onClick={handleGoBack}>Back to Task List</button>
    </div>
  );
}

export default TaskDetails;
