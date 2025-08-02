import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../API';

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      await API.post(`/auth/reset-password/${token}`, { password });
      setMessage('✅ Password changed successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || '❌ Error resetting password');
    }
  };
  
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="border border-zinc-800 rounded-[10px] p-6 w-full max-w-md shadow-lg">
        <h2 className="text-center text-xl mb-4">Reset Password</h2>
        {message && <p className="text-green-600 mb-4 text-center">{message}</p>}
        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="password" className="block mb-1">New Password</label>
          <input
            id="password"
            type="password"
            required
            className="border border-gray-300 rounded p-2 w-full mb-4 outline-0"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button 
            type="submit" 
            className="bg-blue-600 text-white px-4 py-2 rounded w-full cursor-pointer hover:bg-blue-700 transition"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
}
