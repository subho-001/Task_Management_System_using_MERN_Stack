import axios from 'axios';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import styles from '../CSS/TaskForm.module.css';

function TaskForm() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    console.log(data);

    const token = localStorage.getItem('token');

    try {
      const response = await axios.post('http://localhost:5000/api/tasks/create', data, {
        headers: {
          'Authorization': `Bearer ${token}`,  // Add the token in the Authorization header
        },
      });

      if (response.status === 201) {
        alert('Task created successfully');
        navigate('/tasklist');
      }
    } catch (error) {
      if (error.response) {
        console.error('Error Response', error.response.data);
        alert(error.response.data.message || 'Failed to create task.');
      } else if (error.request) {
        console.error('No Response:', error.request);
        alert('Failed to connect to the server');
      } else {
        console.error('Error:', error.message);
        alert('An unexpected error occurred');
      }
    }
  };

  const handleGoBack = () => {
    navigate('/tasklist');
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Create Task</h2>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Title</label>
          <input
            type="text"
            className={styles.input}
            {...register('title', { required: 'Title is required' })}
          />
          {errors.title && <p className={styles.error}>{errors.title.message}</p>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Description</label>
          <textarea
            className={styles.textarea}
            {...register('description', { required: 'Description is required' })}
          />
          {errors.description && <p className={styles.error}>{errors.description.message}</p>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Due Date</label>
          <input
            type="date"
            className={styles.input}
            {...register('dueDate', { required: 'Due date is required' })}
          />
          {errors.dueDate && <p className={styles.error}>{errors.dueDate.message}</p>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Priority</label>
          <select
            className={styles.select}
            {...register('priority', { required: 'Priority is required' })}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          {errors.priority && <p className={styles.error}>{errors.priority.message}</p>}
        </div>

        <button type="submit" className={styles.submitButton}>Create Task</button>

        <button className={styles.back_btn }onClick={handleGoBack}>Back to Task List</button>
      </form>
    </div>
  );
}

export default TaskForm;
