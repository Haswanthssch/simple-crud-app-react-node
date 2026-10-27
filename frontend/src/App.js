import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'https://my-crud-api-9yao.onrender.com';

function App() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');

  // Fetch all users on component mount
  useEffect(() => {
    axios.get(API_URL)
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  // --- Event Handlers ---

  const handleCreateUser = (e) => {
    e.preventDefault();
    axios.post(API_URL, { name: newUser, email: newUserEmail })
      .then(response => {
        setUsers([...users, response.data]);
        setNewUser('');
        setNewUserEmail('');
      });
  };

  const handleUpdateUser = (id) => {
    axios.put(`${API_URL}/${id}`, editingUser)
      .then(response => {
        setUsers(users.map(user => (user.id === id ? response.data : user)));
        setEditingUser(null);
      });
  };

  const handleDeleteUser = (id) => {
    axios.delete(`${API_URL}/${id}`)
      .then(() => {
        setUsers(users.filter(user => user.id !== id));
      });
  };

  // --- Render Logic ---

  return (
    <div className="App">
      <h1>User Management</h1>

      {/* Create User Form */}
      <form onSubmit={handleCreateUser}>
        <input
          type="text"
          value={newUser}
          onChange={(e) => setNewUser(e.target.value)}
          placeholder="Enter user name"
          aria-label="New user name"
          required
        />
        <input
          type="email"
          value={newUserEmail}
          onChange={(e) => setNewUserEmail(e.target.value)}
          placeholder="Enter email address"
          aria-label="New user email"
          required
        />
        <button type="submit">Add User</button>
      </form>

      {/* Users List */}
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {editingUser && editingUser.id === user.id ? (
              // Edit Mode
              <div>
                <input
                  type="text"
                  value={editingUser.name}
                  aria-label={`Edit ${user.name} name`}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                />
                <input
                  type="email"
                  value={editingUser.email || ''}
                  aria-label={`Edit ${user.name} email`}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  required
                />
                <button onClick={() => handleUpdateUser(user.id)}>Save</button>
                <button onClick={() => setEditingUser(null)}>Cancel</button>
              </div>
            ) : (
              // View Mode
              <div>
                <div className="user-details">
                  <span>{user.name}</span>
                  {user.email && <span className="user-email">{user.email}</span>}
                </div>
                <button onClick={() => setEditingUser({ ...user })}>Edit</button>
                <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
