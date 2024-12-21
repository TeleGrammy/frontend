import React, { useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';
const apiUrl = import.meta.env.VITE_API_URL;

function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [availableGroups, setAvailableGroups] = useState([]);
  const [applyFilter, setApplyFilter] = useState(false);

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
        console.log(data);
        setRegisteredUsers(data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
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
        console.log(data);
        setAvailableGroups(data.data);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }

      setLoading(false);
    };
    fetchUserData();
  }, []);

  const handleChangeUser = async (userId, stat) => {
    if (stat === 'banned')
      setRegisteredUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
    const data = { status: stat };
    registeredUsers.status = stat;
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
        console.log('Error banning user:', response);
      } else {
        const result = await response.json();
        console.log('User Changed successfully:', result);
      }
    } catch (error) {
      console.error('Error banning user:', error);
    }
  };

  const handleApplyFilter = async (groupId,status) => {
    const data = {
        applyFilter: status
    }
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
          console.log('Filter applies successfully:', result);
        }
      } catch (error) {
        console.error('Error:', error);
      }
  };

  return (
    <div className="bg-gray-200 p-5 rounded flex min-h-screen overflow-y-auto">
      <div className="w-1/2 pr-5">
        <h1 className="text-gray-700 text-2xl mb-5">Registered Users</h1>
        {loading ? (
          <ClipLoader color="#000" loading={loading} size={35} />
        ) : (
          <ul className="list-none p-0 overflow-y-auto h-96 bg-white rounded shadow no-scrollbar">
            {registeredUsers.map((user) => (
              <li key={user._id} className="mb-3 p-3 bg-gray-100 rounded">
                <span className="mr-3">{user.username}</span>
                <span className="">{user.email}</span>
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
      <div className="w-1/2 pl-5">
        <h1 className="text-gray-700 text-2xl mb-5">Available Groups</h1>
        <ul className="list-none p-0 overflow-y-auto h-96 bg-white rounded shadow min-h-screen no-scrollbar">
          {availableGroups.map((group) => (
            <li key={group._id} className="mb-3 p-3 bg-gray-100 rounded">
              <span>{group.name}</span>
              {group.groupPermissions.applyFilter ? (
                <button onClick={() => handleApplyFilter(group._id,false)} className="bg-red-500 text-white px-3 py-1 rounded mt-3 ml-3">
                  Remove Inappropriate Content Filter
                </button>
              ) : (
                <button onClick={() => handleApplyFilter(group._id,true)} className="bg-green-500 text-white px-3 py-1 rounded mt-3 ml-3">
                  Apply Inappropriate Content Filter
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AdminDashboard;