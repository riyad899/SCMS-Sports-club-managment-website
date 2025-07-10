// cloudinaryUpload.js

export const uploadToCloudinary = async (file) => {
  const CLOUD_NAME = 'dkneuc0qc';
  const UPLOAD_PRESET = 'unsigned_preset';

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  try {
    const res = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    if (data.secure_url) {
      return { success: true, url: data.secure_url };
    } else {
      throw new Error('Upload failed');
    }
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    return { success: false, error };
  }
};
