import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate, useLocation } from "react-router"; // <-- useLocation added
import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { useAuth } from "../../Component/hooks/AuthContext";
import { UseaxiousSecure } from "../../Component/hooks/UseaxiousSecure";

const Login = () => {
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const axiosSecure = UseaxiousSecure();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

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
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const result = await signIn(form.email, form.password);
      const user = result.user;

      // Check if user already exists in database
      try {
        const checkUserResponse = await axiosSecure.get(`/users/${user.email}`);
        console.log('User already exists in database');
      } catch (error) {
        // If user doesn't exist, create new user in database
        if (error.response && error.response.status === 404) {
          const userData = {
            name: user.displayName || user.email.split('@')[0],
            email: user.email,
            password: '', // Don't store password for security
            role: "user",
            isMember: false,
            membershipDate: null,
            profileImage: user.photoURL || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          await saveUserMutation.mutateAsync(userData);
        }
      }

      await Swal.fire({
        icon: "success",
        title: "Login Successful!",
        confirmButtonColor: "#162E50",
      });
      navigate("/", { replace: true }); // Always redirect to home page after login
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    try {
      const result = await signInWithGoogle();
      const user = result.user;

      // Check if user already exists in database
      try {
        const checkUserResponse = await axiosSecure.get(`/users/${user.email}`);
        // If user exists, just login
        console.log('User already exists in database');
      } catch (error) {
        // If user doesn't exist, create new user in database
        if (error.response && error.response.status === 404) {
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

          await saveUserMutation.mutateAsync(userData);
        }
      }

      await Swal.fire({
        icon: "success",
        title: "Logged in with Google!",
        confirmButtonColor: "#162E50",
      });
      navigate("/", { replace: true }); // Always redirect to home page after login
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8]">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-center text-[#162E50] mb-6">Login</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="label">
              <span className="label-text">Email</span>
            </label>
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
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full bg-[#162E50] border-none hover:bg-[#1c3a66]"
          >
            Login
          </button>
        </form>

        {/* Google Login Button */}
        <div className="mt-4">
          <button
            onClick={handleGoogleLogin}
            className="btn w-full flex items-center justify-center gap-2 bg-white text-black border border-gray-300 hover:bg-gray-100 mt-2"
          >
            <FcGoogle className="text-xl" />
            Continue with Google
          </button>
        </div>

        <p className="text-sm mt-4 text-center">
          Don’t have an account?{" "}
          <Link to="/register" className="text-[#162E50] font-semibold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
