// src/components/FrontPage.jsx
import React from 'react';
import { useRouter } from 'next/router';

const FrontPage = () => {
  const router = useRouter();

  const handleGetMeInClick = () => {
    router.push('/chat'); // Adjust this route if your chat page is located elsewhere
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#131314] text-white">
      <div className="text-center p-6">
        <h1 className="text-4xl font-bold mb-4">Welcome to UEA Chatbot</h1>
        <p className="text-lg mb-6">
          This is a safe space where you can ask questions and get assistance
          about the University of East Anglia. Our chatbot is here to help you
          with any queries you may have.
        </p>
        <button
          onClick={handleGetMeInClick}
          className="bg-purple-600 text-white py-2 px-4 rounded-full text-xl"
        >
          Get Me In
        </button>
      </div>
    </div>
  );
};

export default FrontPage;
