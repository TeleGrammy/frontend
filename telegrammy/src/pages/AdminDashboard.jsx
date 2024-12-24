import React, { useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { CiLogout } from "react-icons/ci";

const apiUrl = import.meta.env.VITE_API_URL;
const isAdmin = JSON.parse(localStorage.getItem('user'))?.isAdmin;

function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [availableGroups, setAvailableGroups] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${apiUrl}/v1/admins/users`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
          credentials: 'include',
        });
        const data = await response.json();
        setRegisteredUsers(data.data || []); // Ensure it's an array
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoadingUsers(false);
      }

      try {
        const response = await fetch(`${apiUrl}/v1/admins/groups`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
          credentials: 'include',
        });
        const data = await response.json();
        setAvailableGroups(data.data || []); // Ensure it's an array
      } catch (error) {
        console.error('Error fetching groups:', error);
      } finally {
        setLoadingGroups(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChangeUser = async (userId, stat) => {
    if (stat === 'banned')
      setRegisteredUsers((prevUsers) =>
        prevUsers.filter((user) => user._id !== userId)
      );

    const data = { status: stat };
    try {
      const response = await fetch(`${apiUrl}/v1/admins/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.log('Error updating user:', response);
      } else {
        const result = await response.json();
        console.log('User updated successfully:', result);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleApplyFilter = async (groupId, status) => {
    const data = {
      applyFilter: status,
    };
    try {
      const response = await fetch(`${apiUrl}/v1/admins/filter/${groupId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.log('Error applying filter:', response);
      } else {
        const result = await response.json();
        console.log('Filter applied successfully:', result);
      }
    } catch (error) {
      console.error('Error applying filter:', error);
    }
  };

  const Logout = async () => {
    try {
      const response = await fetch(`${apiUrl}/v1/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        console.log('Logout Success');
        dispatch(logout());
        navigate('/');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col bg-gray-200">
      {/* Logout Button */}
      <div className="flex justify-end p-5 bg-gray-300">
        <button
          onClick={Logout}
          className="flex items-center bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600"
        >
          <CiLogout size={20} className="mr-2" /> Logout
        </button>
      </div>
  
      {/* Main Content */}
      <div className="bg-gray-200 p-5 rounded flex min-h-screen overflow-y-auto">
        {/* Registered Users Section */}
        <div className="w-1/2 pr-5">
          <h1 className="text-gray-700 text-2xl mb-5">Registered Users</h1>
          {loadingUsers ? (
            <ClipLoader color="#000" loading={loadingUsers} size={35} aria-label="Loading users" />
          ) : (
            <ul className="list-none p-0 overflow-y-auto h-96 bg-white rounded shadow no-scrollbar">
              {registeredUsers.map((user) => (
                <li key={user._id} className="mb-3 p-3 bg-gray-100 rounded">
                  <span className="mr-3">{user.username}</span>
                  <span>{user.email}</span>
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded mr-3 ml-3"
                    onClick={() => handleChangeUser(user._id, 'banned')}
                  >
                    Ban
                  </button>
                  {user.status === 'inactive' ? (
                    <button
                      className="bg-orange-500 text-white px-3 py-1 rounded"
                      onClick={() => handleChangeUser(user._id, 'active')}
                    >
                      Activate
                    </button>
                  ) : (
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                      onClick={() => handleChangeUser(user._id, 'inactive')}
                    >
                      Deactivate
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
  
        {/* Available Groups Section */}
        <div className="w-1/2 pl-5">
          <h1 className="text-gray-700 text-2xl mb-5">Available Groups</h1>
          {loadingGroups ? (
            <ClipLoader color="#000" loading={loadingGroups} size={35} aria-label="Loading groups" />
          ) : (
            <ul className="list-none p-0 overflow-y-auto h-96 bg-white rounded shadow no-scrollbar">
              {availableGroups.map((group) => (
                <li key={group._id} className="mb-3 p-3 bg-gray-100 rounded">
                  <span>{group.name}</span>
                  {group.groupPermissions.applyFilter ? (
                    <button
                      onClick={() => handleApplyFilter(group._id, false)}
                      className="bg-red-500 text-white px-3 py-1 rounded mt-3 ml-3"
                    >
                      Remove Inappropriate Content Filter
                    </button>
                  ) : (
                    <button
                      onClick={() => handleApplyFilter(group._id, true)}
                      className="bg-green-500 text-white px-3 py-1 rounded mt-3 ml-3"
                    >
                      Apply Inappropriate Content Filter
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;