import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/auth/login', { email, password });
      console.log(res.data);

      // Save token in local storage
      localStorage.setItem('token', res.data.token);

      alert('✅ Login successful');
      navigate('/dashboard'); // Redirect to dashboard
    } catch (err) {
      alert(err.response?.data?.error || 'Login error');
    }
  };

  return (
    <>
      <div className="h-screen flex">
        {/* Left side */}
        <div className="w-1/2 bg-gray-100 flex flex-col p-10">
          <header>
            <h1 className="text-blue-950 text-5xl font-bold mb-6 drop-shadow-md">THE APP</h1>
          </header>
          <div className="h-[70%] relative flex w-full items-center justify-center">
            <form onSubmit={handleSubmit} className="flex-col p-10 items-center justify-center w-[65%]">
              <p className="text-zinc-800">Start your journey</p>
              <h1 className="text-2xl mb-10">Sign in to the app</h1>

              <div className="flex flex-col border-1 p-1 my-5 rounded-[5px] w-full border-zinc-600">
                <label className="text-zinc-600 p-1" htmlFor="email">E-mail</label>
                <input
                  className="h-[30px] outline-0 p-1 mb-1 mx-1"
                  type="email"
                  name="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

              <div className="flex flex-col border-1 p-1 my-5 rounded-[5px] w-full border-zinc-600">
                <label className="text-zinc-600 p-1">Password</label>
                <input
                  className="h-[30px] outline-0 p-1 mb-1 mx-1"
                  type="password"
                  name="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>

              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="remember" className="ml-2 text-gray-700">
                  Remember me
                </label>
              </div>

              <button
                type="submit"
                className="w-full mt-5 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition cursor-pointer"
              >
                Sign In
              </button>
            </form>
          </div>

          <div className="relative flex justify-between w-full px-6">
            <p>
              Don’t have an account?{' '}
              <a href="/register" className="text-blue-600 cursor-pointer hover:underline">
                Sign up
              </a>
            </p>
            <a href="/forgot-password" className="self-end text-blue-600 cursor-pointer hover:underline">
              Forgot Password?
            </a>
          </div>
        </div>

        {/* Right side */}
        <div className="w-1/2 bg-gradient-to-t from-blue-950 to-cyan-500 flex items-center justify-center"></div>
      </div>
    </>
  );
}
