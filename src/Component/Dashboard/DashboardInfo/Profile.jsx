import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../hooks/AuthContext';
import { UseaxiosPublic } from '../../hooks/UseAxiosPublic';
import Loading from '../../Loading/Loading';
import { FaEdit, FaSave, FaTimes, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaUserShield } from 'react-icons/fa';
import { toast } from 'react-toastify';

export const Profile = () => {
  const { user } = useAuth();
  const axiosSecure = UseaxiosPublic();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});

  const { data: currentUserData, isLoading } = useQuery({
    queryKey: ['user', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users?email=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async (updatedData) => {
      const res = await axiosSecure.patch(`/users/${currentUser._id}`, updatedData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['user', user?.email]);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    },
    onError: (error) => {
      toast.error('Failed to update profile');
      console.error(error);
    }
  });

  const currentUser = currentUserData;

  if (isLoading) return <Loading />;

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto mt-10 bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h2>
        <p className="text-red-500">User profile not found.</p>
      </div>
    );
  }

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData({
      name: currentUser?.name || '',
      phone: currentUser?.phone || '',
      address: currentUser?.address || '',
      bio: currentUser?.bio || ''
    });
  };

  const handleSave = () => {
    updateUserMutation.mutate(editedData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({});
  };

  const handleInputChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 space-y-6">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <img
              src={currentUser?.profileImage || user?.photoURL || "https://via.placeholder.com/150"}
              alt={currentUser?.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center">
              <span className="text-xs font-bold">✓</span>
            </div>
          </div>
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-3xl font-bold">{currentUser?.name || 'No Name Provided'}</h1>
            <p className="text-blue-100 text-lg">{currentUser?.email}</p>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
              <FaUserShield className="text-yellow-300" />
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm text-black font-medium">
                {currentUser?.role?.toUpperCase() || 'USER'}
              </span>
              {currentUser?.isMember && (
                <span className="bg-yellow-400 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                  MEMBER
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-black px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <FaEdit /> Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={updateUserMutation.isPending}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  <FaSave /> Save
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <FaTimes /> Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Information Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaUser className="text-blue-500" />
            Personal Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-800 font-medium">{currentUser?.name || 'Not provided'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
              <p className="text-gray-800 font-medium flex items-center gap-2">
                <FaEnvelope className="text-gray-400" />
                {currentUser?.email}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editedData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter phone number"
                />
              ) : (
                <p className="text-gray-800 font-medium flex items-center gap-2">
                  <FaPhone className="text-gray-400" />
                  {currentUser?.phone || 'Not provided'}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Address</label>
              {isEditing ? (
                <textarea
                  value={editedData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="2"
                  placeholder="Enter address"
                />
              ) : (
                <p className="text-gray-800 font-medium flex items-center gap-2">
                  <FaMapMarkerAlt className="text-gray-400" />
                  {currentUser?.address || 'Not provided'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaUserShield className="text-green-500" />
            Account Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Registration Date</label>
              <p className="text-gray-800 font-medium flex items-center gap-2">
                <FaCalendarAlt className="text-gray-400" />
                {new Date(currentUser?.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Account Type</label>
              <p className="text-gray-800 font-medium">{currentUser?.role || 'User'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Membership Status</label>
              <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                currentUser?.isMember 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {currentUser?.isMember ? 'Active Member' : 'Regular User'}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Last Login</label>
              <p className="text-gray-800 font-medium">
                {user?.metadata?.lastSignInTime 
                  ? new Date(user.metadata.lastSignInTime).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  : 'Not available'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">About Me</h3>
        {isEditing ? (
          <textarea
            value={editedData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="4"
            placeholder="Tell us about yourself..."
          />
        ) : (
          <p className="text-gray-700 leading-relaxed">
            {currentUser?.bio || 'No bio provided yet. Click edit to add information about yourself.'}
          </p>
        )}
      </div>
    </div>

  )
}
