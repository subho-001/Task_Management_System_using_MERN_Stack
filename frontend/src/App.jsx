import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import TaskList from './pages/TaskList';
import TaskDetails from './pages/TaskDetails';
import TaskForm from './pages/TaskForm';
import EditTask from './pages/EditTask';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Login/>} />
        <Route path='/' element={<Login/>} />
        <Route path='/signup' element={<Signup/>} />

        <Route path='/tasklist' element={
          <ProtectedRoute>
            <TaskList/>
          </ProtectedRoute>
        } 
        />

        <Route path='/tasks/:taskId' element={
          <ProtectedRoute>
            <TaskDetails/>
          </ProtectedRoute>
        } />

        <Route path='/editTask/:taskId' element={
          <ProtectedRoute>
            <EditTask/>
          </ProtectedRoute>
        } />

        <Route path='/create_task' element={
          <ProtectedRoute>
            <TaskForm/>
          </ProtectedRoute>
        } />

      </Routes>
    </BrowserRouter>
  )
}

export default App;
