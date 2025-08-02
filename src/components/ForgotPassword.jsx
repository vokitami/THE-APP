import { useState } from 'react';
import API from '../API';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    // Validación básica de email
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('❌ Please enter a valid email address.');
      return;
    }

    try {
      await API.post(`/auth/forgot-password`, { email });
      setMessage('✅ If this email exists, you will receive a password reset link.');
    } catch (err) {
      setError(err.response?.data?.error || '❌ Error sending password reset email.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="border border-zinc-800 rounded-[10px] p-6 w-full max-w-md shadow-lg">
        <h2 className="text-center text-xl mb-4">Forgot Password</h2>
        {message && <p className="text-green-600 mb-4 text-center">{message}</p>}
        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-1">Email</label>
            <input
              id="email"
              type="email"
              required
              className="border border-gray-300 rounded p-2 w-full outline-0"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            className="bg-blue-600 text-white px-4 py-2 rounded w-full cursor-pointer hover:bg-blue-700 transition"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
}
