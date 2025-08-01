import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UseaxiosPublic } from '../../hooks/UseAxiosPublic';
import Swal from 'sweetalert2';
import Loading from '../../Loading/Loading';

const ManageCoupons = () => {
  const axiosSecure = UseaxiosPublic();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ code: '', value: '', description: '', expiry: '' });
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const { data: coupons = [], isLoading, error, refetch } = useQuery({
    queryKey: ['coupons'],
    queryFn: async () => {
      try {
        const res = await axiosSecure.get('/coupons');
        return Array.isArray(res.data) ? res.data : [];
      } catch (error) {
        console.error('Error fetching coupons:', error);
        throw error;
      }
    },
    retry: 2,
  });

  // Form validation
  const validateForm = () => {
    const errors = {};

    if (!form.code.trim()) {
      errors.code = 'Coupon code is required';
    } else if (form.code.length < 3) {
      errors.code = 'Coupon code must be at least 3 characters';
    } else if (!/^[A-Z0-9]+$/.test(form.code)) {
      errors.code = 'Coupon code must contain only uppercase letters and numbers';
    }

    if (!form.value || form.value <= 0) {
      errors.value = 'Discount value must be greater than 0';
    } else if (form.value > 100) {
      errors.value = 'Discount value cannot exceed 100%';
    }

    if (!form.expiry) {
      errors.expiry = 'Expiry date is required';
    } else if (new Date(form.expiry) <= new Date()) {
      errors.expiry = 'Expiry date must be in the future';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await axiosSecure.delete(`/coupons/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['coupons']);
      Swal.fire('Deleted!', 'Coupon deleted successfully', 'success');
    },
    onError: (error) => {
      console.error('Error deleting coupon:', error);
      Swal.fire('Error!', 'Failed to delete coupon. Please try again.', 'error');
    },
  });

  const handleDelete = async (id) => {
    try {
      const confirm = await Swal.fire({
        title: 'Delete this coupon?',
        text: 'This action cannot be undone!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        confirmButtonColor: '#d33',
        cancelButtonText: 'Cancel'
      });

      if (confirm.isConfirmed) {
        deleteMutation.mutate(id);
      }
    } catch (error) {
      console.error('Error in delete confirmation:', error);
      Swal.fire('Error!', 'Something went wrong. Please try again.', 'error');
    }
  };

  const handleEdit = (coupon) => {
    try {
      const expiryDate = coupon.expiry ? new Date(coupon.expiry).toISOString().slice(0, 10) : '';
      setForm({
        code: coupon.code || '',
        value: coupon.value || '',
        description: coupon.description || '',
        expiry: expiryDate,
      });
      setEditingId(coupon._id);
      setFormErrors({});
    } catch (error) {
      console.error('Error setting edit form:', error);
      Swal.fire('Error!', 'Failed to load coupon data for editing.', 'error');
    }
  };

  const submitMutation = useMutation({
    mutationFn: async ({ formData, isEditing }) => {
      if (isEditing) {
        const response = await axiosSecure.put(`/coupons/${editingId}`, formData);
        return response.data;
      } else {
        const response = await axiosSecure.post('/coupons', {
          ...formData,
          discountType: 'percentage',
          isActive: true
        });
        return response.data;
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['coupons']);
      const message = variables.isEditing ? 'Coupon updated successfully!' : 'Coupon created successfully!';
      Swal.fire('Success!', message, 'success');
      setForm({ code: '', value: '', description: '', expiry: '' });
      setEditingId(null);
      setFormErrors({});
    },
    onError: (error) => {
      console.error('Error submitting coupon:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save coupon. Please try again.';
      Swal.fire('Error!', errorMessage, 'error');
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = {
      code: form.code.toUpperCase().trim(),
      value: parseFloat(form.value),
      description: form.description.trim(),
      expiry: form.expiry,
    };

    submitMutation.mutate({
      formData,
      isEditing: !!editingId
    });
  };

  const resetForm = () => {
    setForm({ code: '', value: '', description: '', expiry: '' });
    setEditingId(null);
    setFormErrors({});
  };

  if (isLoading) return <Loading />;

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to Load Coupons</h3>
          <p className="text-red-600 mb-4">
            {error.response?.data?.message || 'Unable to fetch coupons. Please check your connection.'}
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
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Manage Coupons</h2>
        <div className="text-sm text-gray-600">
          Total Coupons: {coupons.length}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow-lg p-6 rounded-lg mb-8">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label">
              <span className="label-text font-medium">Coupon Code*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., SAVE20"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              className={`input input-bordered w-full ${formErrors.code ? 'input-error' : ''}`}
              disabled={submitMutation.isPending}
            />
            {formErrors.code && (
              <label className="label">
                <span className="label-text-alt text-error">{formErrors.code}</span>
              </label>
            )}
          </div>

          <div>
            <label className="label">
              <span className="label-text font-medium">Discount Value (%)*</span>
            </label>
            <input
              type="number"
              placeholder="e.g., 20"
              min="1"
              max="100"
              value={form.value}
              onChange={(e) => setForm({ ...form, value: e.target.value })}
              className={`input input-bordered w-full ${formErrors.value ? 'input-error' : ''}`}
              disabled={submitMutation.isPending}
            />
            {formErrors.value && (
              <label className="label">
                <span className="label-text-alt text-error">{formErrors.value}</span>
              </label>
            )}
          </div>
        </div>

        <div>
          <label className="label">
            <span className="label-text font-medium">Description</span>
          </label>
          <input
            type="text"
            placeholder="Brief description of the coupon"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="input input-bordered w-full"
            disabled={submitMutation.isPending}
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text font-medium">Expiry Date*</span>
          </label>
          <input
            type="date"
            value={form.expiry}
            onChange={(e) => setForm({ ...form, expiry: e.target.value })}
            className={`input input-bordered w-full ${formErrors.expiry ? 'input-error' : ''}`}
            disabled={submitMutation.isPending}
            min={new Date().toISOString().split('T')[0]}
          />
          {formErrors.expiry && (
            <label className="label">
              <span className="label-text-alt text-error">{formErrors.expiry}</span>
            </label>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            className="btn btn-primary flex-1"
            type="submit"
            disabled={submitMutation.isPending}
          >
            {submitMutation.isPending ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                {editingId ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              editingId ? 'Update Coupon' : 'Add Coupon'
            )}
          </button>
          {editingId && (
            <button
              type="button"
              className="btn btn-outline"
              onClick={resetForm}
              disabled={submitMutation.isPending}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Coupons Table */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="font-semibold text-gray-700">Code</th>
                <th className="font-semibold text-gray-700">Value (%)</th>
                <th className="font-semibold text-gray-700">Description</th>
                <th className="font-semibold text-gray-700">Expiry</th>
                <th className="font-semibold text-gray-700">Status</th>
                <th className="font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                      </svg>
                      <p className="text-lg font-medium">No coupons found</p>
                      <p className="text-sm">Create your first coupon using the form above</p>
                    </div>
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => {
                  const isExpired = new Date(coupon.expiry) <= new Date();
                  return (
                    <tr key={coupon._id} className="hover:bg-gray-50">
                      <td>
                        <span className="font-mono font-semibold bg-gray-100 px-2 py-1 rounded">
                          {coupon.code}
                        </span>
                      </td>
                      <td>
                        <span className="font-semibold text-green-600">{coupon.value}%</span>
                      </td>
                      <td className="max-w-xs truncate">{coupon.description || 'No description'}</td>
                      <td>
                        <span className={`text-sm ${isExpired ? 'text-red-600' : 'text-gray-600'}`}>
                          {new Date(coupon.expiry).toLocaleDateString()}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${isExpired ? 'badge-error' : 'badge-success'}`}>
                          {isExpired ? 'Expired' : 'Active'}
                        </span>
                      </td>
                      <td className="space-x-2 space-y-3">
                        <button
                          className="btn w-[70px] h-[30px] btn-info"
                          onClick={() => handleEdit(coupon)}
                          disabled={deleteMutation.isPending}
                        >
                          Edit
                        </button>
                        <button
                          className="btn w-[70px] h-[30px] btn-error"
                          onClick={() => handleDelete(coupon._id)}
                          disabled={deleteMutation.isPending}
                        >
                          {deleteMutation.isPending ? (
                            <span className="loading loading-spinner loading-xs"></span>
                          ) : (
                            'Delete'
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageCoupons;
