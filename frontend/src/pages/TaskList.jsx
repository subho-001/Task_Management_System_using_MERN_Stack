import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../css/TaskListPage.module.css'; // Updated to unique CSS file

function TaskList() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTasks = async (page = 1) => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Your session has expired. Please log in again.');
      navigate('/');
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/api/tasks/getTasks?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTasks(response.data.tasks);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message || 'Failed to fetch tasks.');
      } else {
        alert('Failed to connect to the server');
      }
    }
  };

  useEffect(() => {
    fetchTasks(currentPage);
  }, [currentPage]);

  const handleCreateTask = () => {
    navigate('/create_task');
  };

  const handleRowClick = (id) => {
    navigate(`/tasks/${id}`);
  };

  const handleEdit = (e, id) => {
    e.stopPropagation();
    navigate(`/editTask/${id}`);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this Task?')) {
      const token = localStorage.getItem('token');
      try {
        await axios.delete(
          `http://localhost:5000/api/tasks/delete/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTasks(tasks.filter((task) => task._id !== id));
        alert('Task deleted successfully');
      } catch {
        alert('Failed to delete task.');
      }
    }
  };

  const handleStatusUpdate = async (e, id, status) => {
    e.stopPropagation();
    const token = localStorage.getItem('token');
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/tasks/status/${id}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === id ? { ...task, status: response.data.task.status } : task
          )
        );
        alert('Task status updated successfully!');
      }
    } catch {
      alert('Failed to update task status.');
    }
  };

  const renderTaskList = (tasks, priorityClass) => {
    return tasks.map((task) => (
      <li
        key={task._id}
        className={`${styles.taskItem} ${styles[priorityClass]}`}
        onClick={() => handleRowClick(task._id)}
      >
        <h3>{task.title}</h3>
        <p>Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
        <p
          className={
            task.status === 'Completed' ? styles.statusCompleted : styles.statusPending
          }
        >
          {task.status}
        </p>
        <select
          value={task.status}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => handleStatusUpdate(e, task._id, e.target.value)}
        >
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
        <div className={styles.actions}>
          <button className={styles.editButton} onClick={(e) => handleEdit(e, task._id)}>Edit</button>
          <button className={styles.deleteButton} onClick={(e) => handleDelete(e, task._id)}>Delete</button>
        </div>
      </li>
    ));
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/'); 
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Task List</h1>
        <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
      </div>
      <div className={styles.createTaskButton}>
        <button className={styles.addTaskButton} onClick={handleCreateTask}>Add New Task</button>
      </div>
      <div className={styles.taskColumns}>
        <div className={styles.column}>
          <h2 className={styles.highPriority}>High Priority</h2>
          {renderTaskList(tasks.filter((task) => task.priority === 'High'), 'high')}
        </div>
        <div className={styles.column}>
          <h2 className={styles.mediumPriority}>Medium Priority</h2>
          {renderTaskList(tasks.filter((task) => task.priority === 'Medium'), 'medium')}
        </div>
        <div className={styles.column}>
          <h2 className={styles.lowPriority}>Low Priority</h2>
          {renderTaskList(tasks.filter((task) => task.priority === 'Low'), 'low')}
        </div>
      </div>
      <div className={styles.pagination}>
        <button
          className={styles.paginationButton}
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className={styles.paginationButton}
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default TaskList;
