import React from 'react';
import { useNavigate, useRouteError } from 'react-router';
import { Logo } from '../../Component/Logo/Logo';

const Error = () => {
  const navigate = useNavigate();
  const error = useRouteError();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Logo />
        </div>

        {/* Error Icon */}
        <div className="mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-10 h-10 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
        </div>

        {/* Error Content */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {error?.status || '404'}
          </h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            {error?.status === 404 ? 'Page Not Found' : 'Oops! Something went wrong'}
          </h2>
          <p className="text-gray-600 mb-4">
            {error?.statusText || error?.message ||
             "The page you're looking for doesn't exist or has been moved."}
          </p>
          <p className="text-sm text-gray-500">
            Don't worry, you can find plenty of other things on our homepage.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleGoHome}
            className="w-full bg-[#162E50] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#1c3a66] transition-colors duration-200"
          >
            Go Back Home
          </button>

          <button
            onClick={() => window.history.back()}
            className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-200"
          >
            Go Back
          </button>
        </div>

        {/* Additional Help */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-2">
            Still having trouble?
          </p>
          <div className="flex justify-center space-x-4 text-sm">
            <button
              onClick={handleGoHome}
              className="text-[#162E50] hover:underline"
            >
              Visit Homepage
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => navigate('/courts')}
              className="text-[#162E50] hover:underline"
            >
              Browse Courts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error;
