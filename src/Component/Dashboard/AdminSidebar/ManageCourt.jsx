// 📁 src/Component/Dashboard/AdminSidebar/ManageCourt.jsx
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { UseaxiosPublic } from "../../hooks/UseAxiosPublic";
import Swal from "sweetalert2";
import Loading from "../../Loading/Loading";
import { uploadToCloudinary } from "../../../utils/cloudinaryUpload";

export const ManageCourt = () => {
  const axiosSecure = UseaxiosPublic();
  const [newCourt, setNewCourt] = useState({ name: "", type: "", price: "", slots: "", image: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Fallback function to convert image to base64 data URL
  const convertToBase64DataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const uploadImageToCloudinary = async (imageFile) => {
    try {
      // Validate file
      if (!imageFile) {
        throw new Error('No image file provided');
      }

      // Check file size (max 10MB for Cloudinary free tier)
      if (imageFile.size > 10 * 1024 * 1024) {
        throw new Error('Image file is too large. Maximum size is 10MB.');
      }

      // Check file type
      if (!imageFile.type.startsWith('image/')) {
        throw new Error('Please select a valid image file.');
      }

      console.log('Uploading file to Cloudinary:', {
        name: imageFile.name,
        size: imageFile.size,
        type: imageFile.type
      });

      const result = await uploadToCloudinary(imageFile);

      if (result.success) {
        console.log('Cloudinary upload successful:', result.url);
        return result.url;
      } else {
        throw new Error(result.error?.message || 'Cloudinary upload failed');
      }
    } catch (error) {
      console.error('Image upload error:', error);

      // More specific error messages
      if (error.message.includes('fetch')) {
        throw new Error('Network error. Please check your internet connection.');
      } else if (error.message.includes('preset')) {
        throw new Error('Image upload service configuration error.');
      } else {
        throw new Error(error.message || 'Failed to upload image. Please try again.');
      }
    }
  };

  const { data: courtsData = [], refetch, isLoading, error } = useQuery({
    queryKey: ["courts"],
    queryFn: async () => {
      const res = await axiosSecure.get("/courts");
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  // Ensure courts is always an array
  const courts = Array.isArray(courtsData) ? courtsData :
               (courtsData?.data && Array.isArray(courtsData.data)) ? courtsData.data :
               [];

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axiosSecure.delete(`/courts/${id}`);
        refetch();
        Swal.fire("Deleted!", "Court has been deleted successfully.", "success");
      } catch (error) {
        console.error('Delete error:', error);
        Swal.fire("Error!", "Failed to delete court. Please try again.", "error");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form data
      if (!newCourt.name.trim()) {
        Swal.fire("Error!", "Please enter a court name.", "error");
        return;
      }

      if (!newCourt.type.trim()) {
        Swal.fire("Error!", "Please select a court type.", "error");
        return;
      }

      if (!newCourt.price || parseFloat(newCourt.price) <= 0) {
        Swal.fire("Error!", "Please enter a valid price.", "error");
        return;
      }

      if (!newCourt.slots.trim()) {
        Swal.fire("Error!", "Please enter time slots.", "error");
        return;
      }

      if (!newCourt.image) {
        Swal.fire("Error!", "Please select an image.", "error");
        return;
      }      // Upload image first
      console.log('Starting image upload process...');
      console.log('Image file details:', {
        name: newCourt.image.name,
        size: newCourt.image.size,
        type: newCourt.image.type
      });

      let imageUrl;
      try {
        imageUrl = await uploadImageToCloudinary(newCourt.image);
        console.log('Cloudinary upload successful:', imageUrl);
      } catch (uploadError) {
        console.warn('Cloudinary upload failed, using fallback method:', uploadError.message);

        // Fallback: Use base64 data URL (for development/testing)
        imageUrl = await convertToBase64DataURL(newCourt.image);
        console.log('Using base64 fallback - Note: This should be replaced with proper image hosting in production');

        // Show warning to user
        Swal.fire({
          icon: 'warning',
          title: 'Image Upload Notice',
          text: 'Using temporary image storage. Consider uploading to a proper image host.',
          confirmButtonText: 'Continue'
        });
      }

      // Prepare court data
      const courtData = {
        name: newCourt.name.trim(),
        type: newCourt.type.trim(),
        price: parseFloat(newCourt.price),
        slots: newCourt.slots.split(",").map((slot) => slot.trim()).filter(slot => slot),
        image: imageUrl,
      };

      console.log('Sending court data:', courtData);

      // Add court to database
      const response = await axiosSecure.post("/courts", courtData);
      console.log('Court added successfully:', response.data);

      // Reset form
      setNewCourt({ name: "", type: "", price: "", slots: "", image: null });

      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';

      refetch();

      Swal.fire("Success!", "Court has been added successfully.", "success");
    } catch (error) {
      console.error('Submit error:', error);

      // Enhanced error handling to show specific server error
      let errorMessage = "Failed to add court. Please try again.";

      if (error.response) {
        // Server responded with error status
        console.error('Server response error:', error.response.data);
        errorMessage = error.response.data?.message || error.response.data?.error || errorMessage;

        // Log the full response for debugging
        console.error('Full error response:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
      } else if (error.request) {
        // Request was made but no response received
        console.error('Network error:', error.request);
        errorMessage = "Network error. Please check your connection.";
      } else {
        // Something else happened
        console.error('Error:', error.message);
        errorMessage = error.message;
      }

      Swal.fire("Error!", errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Error state
  if (error) {
    return (
      <div className="p-6 bg-white rounded shadow min-h-screen">
        <h2 className="text-2xl font-bold text-[#162E50] mb-4">Manage Courts</h2>
        <div className="text-center py-10 text-red-500">
          <p>Error loading courts: {error.message}</p>
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
      <h2 className="text-2xl font-bold text-[#162E50] mb-6">Manage Courts</h2>

      {/* Add New Court Form */}
      <div className="mb-10 bg-gray-50 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-[#162E50]">Add New Court</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">
              <span className="label-text font-medium">Court Name</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Tennis Court 1, Basketball Arena A"
              className="input input-bordered w-full"
              value={newCourt.name}
              onChange={(e) => setNewCourt({ ...newCourt, name: e.target.value })}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">
                <span className="label-text font-medium">Court Type</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={newCourt.type}
                onChange={(e) => setNewCourt({ ...newCourt, type: e.target.value })}
                required
                disabled={isSubmitting}
              >
                <option value="">Select Court Type</option>
                <option value="Tennis">Tennis</option>
                <option value="Basketball">Basketball</option>
                <option value="Badminton">Badminton</option>
                <option value="Squash">Squash</option>
                <option value="Football">Football</option>
                <option value="Volleyball">Volleyball</option>
              </select>
            </div>

            <div>
              <label className="label">
                <span className="label-text font-medium">Price per Hour</span>
              </label>
              <input
                type="number"
                placeholder="Enter price"
                className="input input-bordered w-full"
                value={newCourt.price}
                onChange={(e) => setNewCourt({ ...newCourt, price: e.target.value })}
                min="0"
                step="0.01"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <label className="label">
              <span className="label-text font-medium">Available Time Slots</span>
            </label>
            <input
              type="text"
              placeholder="e.g., 9:00-10:00, 10:00-11:00, 11:00-12:00"
              className="input input-bordered w-full"
              value={newCourt.slots}
              onChange={(e) => setNewCourt({ ...newCourt, slots: e.target.value })}
              required
              disabled={isSubmitting}
            />
            <div className="label">
              <span className="label-text-alt">Separate multiple slots with commas</span>
            </div>
          </div>

          <div>
            <label className="label">
              <span className="label-text font-medium">Court Image</span>
            </label>
            <input
              type="file"
              className="file-input file-input-bordered w-full"
              onChange={(e) => setNewCourt({ ...newCourt, image: e.target.files[0] })}
              accept="image/*"
              required
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Adding Court...
              </>
            ) : (
              "Add Court"
            )}
          </button>
        </form>
      </div>

      {/* Courts List */}
      {isLoading ? (
        <Loading />
      ) : courts.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <p>No courts found. Add your first court above!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-[#162E50] text-white">
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Type</th>
                <th>Price</th>
                <th>Available Slots</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courts.map((court) => (
                <tr key={court._id} className="hover:bg-gray-50">
                  <td>
                    <img
                      src={court.image}
                      alt={`${court.name} court`}
                      className="w-20 h-14 object-cover rounded-lg shadow-sm"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/80x56?text=Court';
                      }}
                    />
                  </td>
                  <td className="font-bold text-[#162E50]">{court.name}</td>
                  <td className="font-medium">{court.type}</td>
                  <td className="text-green-600 font-semibold">Tk{court.price}/hour</td>
                  <td className="text-sm text-gray-600">
                    {Array.isArray(court.slots) ? court.slots.join(", ") : court.slots}
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(court._id)}
                      className="btn btn-sm btn-error text-white"
                      disabled={isSubmitting}
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
  );
};

export default ManageCourt;
