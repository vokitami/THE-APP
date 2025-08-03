import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TbLock, TbLockOpen } from "react-icons/tb";
import { GoTrash } from "react-icons/go";
import { formatDistanceToNow, format } from 'date-fns';
import API from '../API';

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    API.get('/users')
      .then((res) => {
        const sorted = res.data.sort((a, b) => new Date(b.lastLogin) - new Date(a.lastLogin));
        setUsers(sorted);
      })
      .catch(() => {
        localStorage.removeItem('token');
        navigate('/login');
      });
  }, [navigate]);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(filter.toLowerCase()) ||
      u.email.toLowerCase().includes(filter.toLowerCase())
  );

  const toggleSelect = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((u) => u.id));
    }
  };

  const handleAction = async (action) => {
    if (selectedUsers.length === 0) return;

    try {
      await API.post(`/users/${action}`, { ids: selectedUsers });
      setMessage(`Users ${action} successfully ✅`);

      const res = await API.get('/users');
      setUsers(res.data);
      setSelectedUsers([]);
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage('❌ Error performing the action');
    }
  };

  const formatLastLogin = (date) => {
    if (!date) return { relative: 'Never logged in', exact: '' };
    const dateObj = new Date(date);
    return {
      relative: formatDistanceToNow(dateObj, { addSuffix: true }),
      exact: format(dateObj, 'PPpp'),
    };
  };
  
  return (
    <>
      <header className="flex w-full h-[10vh] bg-gradient-to-t from-blue-950 to-cyan-300 p-4 justify-between">
        <Link to="/login" className="text-3xl ml-10 font-bold text-blue-950">
          THE APP
        </Link>
        <Link to="/login" className="text-3xl mr-20 hover:text-zinc-800 cursor-pointer">
          Logout
        </Link>
      </header>

      <main className="p-6">
        {message && <div className="mb-4 p-3 bg-green-200 text-green-800 rounded">{message}</div>}

        <div className="flex justify-between items-center mb-4">
          <div className='flex flex-row'>
            <button
              onClick={() => handleAction('block')}
              className="flex items-center gap-2 border border-red-500 text-red-500 px-4 py-2 rounded mr-2 hover:bg-red-200"
            >
              <TbLock className='text-[20px]' /> Block
            </button>
            <button
              onClick={() => handleAction('unblock')}
              className="flex items-center gap-2 border border-green-500 text-green-500 px-3 py-2 rounded mr-2 hover:bg-green-200"
              title="Unblock"
            >
              <TbLockOpen className='text-[20px]'/> Unblock
            </button>
            <button
              onClick={() => handleAction('delete')}
              className="flex items-center gap-2 border border-gray-500 px-3 py-2 rounded hover:bg-gray-200"
              title="Delete"
            >
              <GoTrash /> Delete
            </button>
          </div>
          <input
            type="text"
            placeholder="Filter by name or email..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-400 rounded p-2 w-1/3"
          />
        </div>

        <table className="min-w-full border-collapse border-x border-gray-300 mt-4">
          <thead>
            <tr>
              <th className="border-y border-gray-300 p-2 text-center">
                <input
                  type="checkbox"
                  onChange={toggleSelectAll}
                  checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                />
              </th>
              <th className="border-y border-gray-300 p-2 text-center">Name</th>
              <th className="border-y border-gray-300 p-2 text-center">Email</th>
              <th className="border-y border-gray-300 p-2 text-center">Last Login</th>
              <th className="border-y border-gray-300 p-2 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  No matching users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => {
                const loginInfo = formatLastLogin(user.lastLogin);
                return (
                  <tr key={user.id} className={selectedUsers.includes(user.id) ? 'bg-gray-100' : ''}>
                    <td className="border-y border-gray-300 p-2 text-center">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleSelect(user.id)}
                      />
                    </td>
                    <td className="border-y border-gray-300 p-2 text-center">{user.name}</td>
                    <td className="border-y border-gray-300 p-2 text-center">{user.email}</td>
                    <td
                      className="border-y border-gray-300 p-2 text-center"
                      title={loginInfo.exact} // ✅ Tooltip with exact date
                    >
                      {loginInfo.relative}
                    </td>
                    <td className="border-y border-gray-300 p-2 text-center">{user.status}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </main>
    </>
  );
}
