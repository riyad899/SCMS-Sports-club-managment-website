import React from 'react'
import { useQuery } from '@tanstack/react-query';
import { UseaxiosPublic } from '../../hooks/UseAxiosPublic';
import { useState } from 'react';
import Swal from 'sweetalert2';

export const ManageMembers = () => {
     const axiosSecure = UseaxiosPublic();
  const [search, setSearch] = useState('');

  const {
    data: membersData,
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      const res = await axiosSecure.get('/users/role/members');
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
  console.log('membersData:', membersData);

  // Ensure members is always an array
  const members = Array.isArray(membersData) ? membersData :
                  (membersData?.data && Array.isArray(membersData.data)) ? membersData.data :
                  [];

  const handleDelete = async (email) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: `This will permanently remove ${email} from members`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (confirm.isConfirmed) {
      try {
        await axiosSecure.delete(`/users/member/${email}`);
        Swal.fire('Deleted!', `${email} has been removed.`, 'success');
        refetch();
      } catch (error) {
        Swal.fire('Error!', 'Failed to delete the member.', 'error');
        console.error(error);
      }
    }
  };

  const filteredMembers = Array.isArray(members) ? members.filter(member =>
    member?.name?.toLowerCase().includes(search.toLowerCase())
  ) : [];

  // Add error handling
  if (error) {
    return (
      <div className="p-6 bg-white rounded shadow min-h-screen">
        <h2 className="text-2xl font-bold mb-4">Manage Members</h2>
        <div className="text-center py-10 text-red-500">
          <p>Error loading members: {error.message}</p>
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
  <div className="p-6 bg-white rounded shadow min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Manage Members</h2>

      <input
        type="text"
        placeholder="Search members by name..."
        className="input input-bordered w-full max-w-sm mb-6"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {isLoading ? (
        <div className="text-center py-10">Loading members...</div>
      ) : filteredMembers.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No members found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Name</th>
                <th>Email</th>
                <th>Membership Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member, idx) => (
                <tr key={member._id}>
                  <td>{idx + 1}</td>
                  <td>
                    <img
                      src={member.profileImage}
                      alt={member.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>
                  <td>{member.name}</td>
                  <td>{member.email}</td>
                  <td>{member.membershipDate ? new Date(member.membershipDate).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(member.email)}
                      className="btn btn-sm bg-red-500 hover:bg-red-600 text-white"
                    >
                      Delete
                    </button>
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
