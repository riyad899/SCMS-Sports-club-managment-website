import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../Component/hooks/AuthContext";
import { UseaxiousSecure } from "../../Component/hooks/UseaxiousSecure";

const imgbbAPIKey = "88ed2c44b36d4368306e54cd85785522";

const Register = () => {
  const { createUser, updateUserProfile, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = UseaxiousSecure();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    image: null,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Mutation for saving user data to database
  const saveUserMutation = useMutation({
    mutationFn: async (userData) => {
      const response = await axiosSecure.post('/users', userData);
      return response.data;
    },
    onSuccess: () => {
      console.log('User data saved successfully');
    },
    onError: (error) => {
      console.error('Error saving user data:', error);
    }
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]); // only base64 part
      reader.onerror = (error) => reject(error);
    });

  const uploadImageToImgbb = async (base64Img) => {
    const formData = new FormData();
    formData.append("image", base64Img);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.success) return data.data.url;
    throw new Error("Image upload failed");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { name, email, password, confirmPassword, image } = form;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!image) {
      setError("Please upload a profile image");
      setLoading(false);
      return;
    }

    try {
      const base64Img = await convertToBase64(image);
      const imageUrl = await uploadImageToImgbb(base64Img);

      const userCred = await createUser(email, password);

      await updateUserProfile({
        displayName: name,
        photoURL: imageUrl,
      });

      // Prepare user data for database
      const userData = {
        name: name,
        email: email,
        password: password, // Note: You should hash this on the backend
        role: "user",
        isMember: false,
        membershipDate: null,
        profileImage: imageUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Save user data to database
      await saveUserMutation.mutateAsync(userData);

      // ✅ SweetAlert on success
      Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: "Welcome to Sports Club Management System!",
        confirmButtonColor: "#162E50",
      });

      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      const user = result.user;

      // Check if user already exists in database
      try {
        const checkUserResponse = await axiosSecure.get(`/users?email=${user.email}`);
        console.log('User already exists in database');
      } catch (error) {
        // If user doesn't exist or error occurred, create new user in database
        if (error.response && (error.response.status === 404 || error.response.status === 500)) {
          console.log('Creating new user in database...');
          const userData = {
            name: user.displayName || user.email.split('@')[0],
            email: user.email,
            password: '', // Google users don't have password
            role: "user",
            isMember: false,
            membershipDate: null,
            profileImage: user.photoURL || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          try {
            await saveUserMutation.mutateAsync(userData);
            console.log('Google user saved to database successfully');
          } catch (saveError) {
            console.error('Error saving Google user to database:', saveError);
            // Don't block registration if database save fails
          }
        } else {
          console.error('Unexpected error checking user:', error);
        }
      }

      Swal.fire({
        icon: "success",
        title: "Registered with Google!",
        confirmButtonColor: "#162E50",
      });

      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8]">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-center text-[#162E50] mb-6">Register</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="label"><span className="label-text">Name</span></label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div>
            <label className="label"><span className="label-text">Email</span></label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div>
            <label className="label"><span className="label-text">Profile Image</span></label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="file-input file-input-bordered w-full"
              required
            />
          </div>

          <div>
            <label className="label"><span className="label-text">Password</span></label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div>
            <label className="label"><span className="label-text">Confirm Password</span></label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full bg-[#162E50] border-none hover:bg-[#1c3a66]"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Google Sign Up Button */}
        <div className="mt-4">
          <button
            onClick={handleGoogleSignup}
            className="btn w-full flex items-center justify-center gap-2 bg-white text-black border border-gray-300 hover:bg-gray-100"
          >
            <FcGoogle className="text-xl" />
            Register with Google
          </button>
        </div>

        <p className="text-sm mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-[#162E50] font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
