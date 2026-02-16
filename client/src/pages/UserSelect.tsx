import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { userApi, User } from '../services/api';

export default function UserSelect() {
  const navigate = useNavigate();
  const { setCurrentUser } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserGrade, setNewUserGrade] = useState(2);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await userApi.getAll();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = (user: User) => {
    setCurrentUser(user);
    navigate('/');
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUserName.trim()) return;

    try {
      const newUser = await userApi.create(newUserName, newUserGrade);
      setCurrentUser(newUser);
      navigate('/');
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Failed to create user. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🐝</div>
          <p className="text-2xl">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-bee-orange mb-4 animate-float">
            🐝 Welcome!
          </h1>
          <p className="text-2xl text-gray-700">Who's learning today?</p>
        </div>

        {/* User selection */}
        {!showCreateForm ? (
          <>
            {users.length > 0 && (
              <div className="space-y-4 mb-8">
                {users.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleSelectUser(user)}
                    className="card w-full hover:scale-105 transition-transform bg-gradient-to-r from-bee-yellow to-bee-gold"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <h2 className="text-3xl font-bold text-gray-900">{user.name}</h2>
                        <p className="text-lg text-gray-700">Grade {user.grade}</p>
                      </div>
                      <span className="text-5xl">👋</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() => setShowCreateForm(true)}
              className="btn-primary w-full text-2xl"
            >
              ➕ Create New Student
            </button>
          </>
        ) : (
          <div className="card">
            <h2 className="text-3xl font-bold mb-6 text-center text-bee-orange">
              Create New Student
            </h2>
            
            <form onSubmit={handleCreateUser} className="space-y-6">
              <div>
                <label className="block text-xl font-bold mb-2">Student Name:</label>
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="Enter name..."
                  className="input-field"
                  autoFocus
                  required
                />
              </div>

              <div>
                <label className="block text-xl font-bold mb-2">Grade Level:</label>
                <select
                  value={newUserGrade}
                  onChange={(e) => setNewUserGrade(parseInt(e.target.value))}
                  className="input-field"
                >
                  {[1, 2, 3, 4, 5, 6].map((grade) => (
                    <option key={grade} value={grade}>
                      Grade {grade}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4">
                <button type="submit" className="btn-primary flex-1">
                  Create Student
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-3 bg-gray-400 text-white rounded-full hover:bg-gray-500 flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
