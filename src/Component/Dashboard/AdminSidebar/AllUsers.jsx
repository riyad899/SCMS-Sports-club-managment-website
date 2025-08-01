import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query';
import { UseaxiosPublic } from '../../hooks/UseAxiosPublic';
import Loading from '../../Loading/Loading';


export const AllUsers = () => {
  const axiosSecure = UseaxiosPublic();
  const [searchTerm, setSearchTerm] = useState('');

  const {
    data: usersData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['all-users'],
    queryFn: async () => {
      const res = await axiosSecure.get('/users');
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  // Ensure users is always an array
  const users = Array.isArray(usersData) ? usersData :
               (usersData?.data && Array.isArray(usersData.data)) ? usersData.data :
               [];

  const filteredUsers = Array.isArray(users) ? users.filter(user =>
    user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  if (isLoading) return <Loading />;

  if (isError) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-[#162E50] mb-4">All Users</h2>
        <div className="text-center py-10 text-red-500">
          <p>Error loading users: {error?.message || 'Failed to fetch users'}</p>
          <button
            onClick={() => refetch()}
            className="btn btn-primary mt-4"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
 <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-[#162E50] mb-4">All Users</h2>

      <input
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="input input-bordered mb-4 w-full max-w-md"
      />

      {filteredUsers.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          {searchTerm ? 'No users found matching your search.' : 'No users found.'}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-[#162E50] text-white">
              <tr>
                <th>#</th>
                <th>Profile</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Member</th>
                <th>Join Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user._id} className="hover:bg-gray-100">
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={user.profileImage || '/default-avatar.png'}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/40x40?text=User';
                      }}
                    />
                  </td>
                  <td className="font-medium">{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.role === 'admin'
                        ? 'bg-red-100 text-red-800'
                        : user.role === 'member'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span className={`text-lg ${user.isMember ? 'text-green-500' : 'text-red-500'}`}>
                      {user.isMember ? '✅' : '❌'}
                    </span>
                  </td>
                  <td className="text-sm text-gray-500">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
