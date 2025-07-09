import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../hooks/AuthContext';
import { UseaxiousSecure } from '../../hooks/UseaxiousSecure';
import Loading from '../../Loading/Loading';

export const Profile = () => {
const { user } = useAuth();
  const axiosSecure = UseaxiousSecure();

  const { data: currentUserData, isLoading } = useQuery({
    queryKey: ['user', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users?email=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email
  });


  // Extract the user object from the array
  const currentUser = currentUserData;

  console.log(currentUser);
  if (isLoading) return <Loading />;

  if (!currentUser) {
    return (
      <div className="max-w-3xl mx-auto mt-10 bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h2>
        <p className="text-red-500">User profile not found.</p>
      </div>
    );
  }


  return (
   <div className="max-w-3xl mx-auto mt-10 bg-white shadow-lg rounded-xl p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h2>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <img
          src={currentUser?.profileImage || "https://via.placeholder.com/150"}
          alt={currentUser?.name}
          className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-md"
        />
        <div className="space-y-2">
          <p><span className="font-semibold">Name:</span> {currentUser?.name}</p>
          <p><span className="font-semibold">Email:</span> {currentUser?.email}</p>
          <p><span className="font-semibold">Role:</span> {currentUser?.role}</p>
          <p><span className="font-semibold">Member:</span> {currentUser?.isMember ? 'Yes' : 'No'}</p>
          <p>
            <span className="font-semibold">Registration Date:</span>{' '}
            {new Date(currentUser?.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>

  )
}
