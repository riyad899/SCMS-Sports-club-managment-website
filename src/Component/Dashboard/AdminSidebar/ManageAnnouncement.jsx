// 📁 src/Component/Dashboard/AdminSidebar/ManageAnnouncement.jsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UseaxiousSecure } from '../../hooks/UseaxiousSecure';
import { useState } from 'react';
import Swal from 'sweetalert2';
import Loading from '../../Loading/Loading';

export const ManageAnnouncement = () => {
  const axiosSecure = UseaxiousSecure();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const { data: announcementsData = [], isLoading, error, refetch } = useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      try {
        const res = await axiosSecure.get('/announcements');
        return res.data;
      } catch (error) {
        console.error('Error fetching announcements:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch announcements');
      }
    },
    retry: 2,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  // Ensure announcements is always an array
  const announcements = Array.isArray(announcementsData) ? announcementsData :
                       (announcementsData?.data && Array.isArray(announcementsData.data)) ? announcementsData.data :
                       [];

  // Debug log to check announcements data
  console.log('Announcements data:', announcements);

  // Form validation
  const validateForm = () => {
    const errors = {};

    if (!form.title.trim()) {
      errors.title = 'Title is required';
    } else if (form.title.trim().length < 3) {
      errors.title = 'Title must be at least 3 characters long';
    } else if (form.title.trim().length > 100) {
      errors.title = 'Title must not exceed 100 characters';
    }

    if (!form.message.trim()) {
      errors.message = 'Message is required';
    } else if (form.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters long';
    } else if (form.message.trim().length > 1000) {
      errors.message = 'Message must not exceed 1000 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const mutationAdd = useMutation({
    mutationFn: async (newAnnouncement) => {
      try {
        const res = await axiosSecure.post('/announcements', newAnnouncement);
        return res.data;
      } catch (error) {
        console.error('Error adding announcement:', error);
        throw new Error(error.response?.data?.message || 'Failed to add announcement');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['announcements']);
      setForm({ title: '', message: '' });
      setFormErrors({});
      setIsSubmitting(false);
      Swal.fire('Success!', 'Announcement has been added successfully.', 'success');
    },
    onError: (error) => {
      console.error('Add announcement error:', error);
      setIsSubmitting(false);
      Swal.fire('Error!', error.message || 'Failed to add announcement. Please try again.', 'error');
    },
  });

  const mutationUpdate = useMutation({
    mutationFn: async ({ id, update }) => {
      try {
        const res = await axiosSecure.put(`/announcements/${id}`, update);
        return res.data;
      } catch (error) {
        console.error('Error updating announcement:', error);
        throw new Error(error.response?.data?.message || 'Failed to update announcement');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['announcements']);
      setEditing(null);
      setForm({ title: '', message: '' });
      setFormErrors({});
      setIsSubmitting(false);
      Swal.fire('Success!', 'Announcement has been updated successfully.', 'success');
    },
    onError: (error) => {
      console.error('Update announcement error:', error);
      setIsSubmitting(false);
      Swal.fire('Error!', error.message || 'Failed to update announcement. Please try again.', 'error');
    },
  });

  const mutationDelete = useMutation({
    mutationFn: async (id) => {
      try {
        const res = await axiosSecure.delete(`/announcements/${id}`);
        return res.data;
      } catch (error) {
        console.error('Error deleting announcement:', error);
        throw new Error(error.response?.data?.message || 'Failed to delete announcement');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['announcements']);
      Swal.fire('Deleted!', 'Announcement has been deleted successfully.', 'success');
    },
    onError: (error) => {
      console.error('Delete announcement error:', error);
      Swal.fire('Error!', error.message || 'Failed to delete announcement. Please try again.', 'error');
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const formData = {
      title: form.title.trim(),
      message: form.message.trim(),
    };

    try {
      if (editing) {
        mutationUpdate.mutate({ id: editing._id, update: formData });
      } else {
        mutationAdd.mutate(formData);
      }
    } catch (error) {
      console.error('Submit error:', error);
      setIsSubmitting(false);
    }
  };

  const handleEdit = (announcement) => {
    try {
      setEditing(announcement);
      setForm({
        title: announcement.title || '',
        message: announcement.message || ''
      });
      setFormErrors({});
    } catch (error) {
      console.error('Error setting edit form:', error);
      Swal.fire('Error!', 'Failed to load announcement data for editing.', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      const confirm = await Swal.fire({
        title: 'Delete this announcement?',
        text: 'This action cannot be undone!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
      });

      if (confirm.isConfirmed) {
        mutationDelete.mutate(id);
      }
    } catch (error) {
      console.error('Error in delete confirmation:', error);
      Swal.fire('Error!', 'Something went wrong. Please try again.', 'error');
    }
  };

  const resetForm = () => {
    setForm({ title: '', message: '' });
    setEditing(null);
    setFormErrors({});
    setIsSubmitting(false);
  };

  // Loading state
  if (isLoading) {
    return <Loading />;
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 bg-white rounded shadow min-h-screen">
        <h2 className="text-2xl font-bold text-[#162E50] mb-4">Manage Announcements</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to Load Announcements</h3>
          <p className="text-red-600 mb-4">
            {error.message || 'Unable to fetch announcements. Please check your connection.'}
          </p>
          <button
            onClick={() => refetch()}
            className="btn btn-outline btn-error"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded shadow min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#162E50]">
          {editing ? 'Edit Announcement' : 'Add New Announcement'}
        </h2>
        {editing && (
          <button
            onClick={resetForm}
            className="btn btn-outline btn-secondary"
          >
            Cancel Edit
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      <div className="mb-10 bg-gray-50 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-[#162E50]">
          {editing ? 'Edit Announcement' : 'Create New Announcement'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">
              <span className="label-text font-medium">Title</span>
            </label>
            <input
              type="text"
              placeholder="Enter announcement title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={`input input-bordered w-full ${formErrors.title ? 'input-error' : ''}`}
              disabled={isSubmitting}
            />
            {formErrors.title && (
              <div className="label">
                <span className="label-text-alt text-red-500">{formErrors.title}</span>
              </div>
            )}
          </div>

          <div>
            <label className="label">
              <span className="label-text font-medium">Message</span>
            </label>
            <textarea
              placeholder="Enter announcement message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className={`textarea textarea-bordered w-full h-32 ${formErrors.message ? 'textarea-error' : ''}`}
              disabled={isSubmitting}
            />
            {formErrors.message && (
              <div className="label">
                <span className="label-text-alt text-red-500">{formErrors.message}</span>
              </div>
            )}
            <div className="label">
              <span className="label-text-alt">{form.message.length}/1000 characters</span>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              className="btn btn-primary"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  {editing ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                <>
                  {editing ? 'Update' : 'Add'} Announcement
                </>
              )}
            </button>

            {editing && (
              <button
                type="button"
                onClick={resetForm}
                className="btn btn-outline"
                disabled={isSubmitting}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <hr className="my-6" />

      {/* Announcements List */}
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-[#162E50]">All Announcements</h2>
        <div className="text-sm text-gray-500">
          {announcements.length} announcement{announcements.length !== 1 ? 's' : ''} found
        </div>
      </div>

      {announcements.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <div className="text-6xl mb-4">📢</div>
          <p className="text-lg mb-2">No announcements yet</p>
          <p>Create your first announcement with a title and message using the form above!</p>
          <p className="text-sm mt-2 text-gray-400">Your announcements will display here with both title and message content.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div
              key={announcement._id}
              className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 mr-4">
                  <div className="mb-3">
                    <h3 className="text-xl font-bold text-[#162E50] mb-2 flex items-center">
                      📢 {announcement.title}
                    </h3>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500 mb-3">
                    <p className="text-gray-800 leading-relaxed text-base whitespace-pre-wrap">
                      {announcement.message || 'No message content'}
                    </p>
                  </div>

                  <div className="flex justify-between items-center text-sm text-gray-500">
                    {announcement.createdAt && (
                      <span>
                        Created: {new Date(announcement.createdAt).toLocaleDateString()} at {new Date(announcement.createdAt).toLocaleTimeString()}
                      </span>
                    )}
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Active
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    className="btn btn-sm btn-warning text-white"
                    onClick={() => handleEdit(announcement)}
                    disabled={isSubmitting}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-error text-white"
                    onClick={() => handleDelete(announcement._id)}
                    disabled={isSubmitting}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageAnnouncement;
