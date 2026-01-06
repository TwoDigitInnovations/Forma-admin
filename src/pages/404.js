import React from "react";
import { useRouter } from "next/router";
import { AlertTriangle } from "lucide-react"; // Icon

const NotFound = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-black px-4">
      {/* Icon */}
      <AlertTriangle className="w-24 h-24 text-[#e0f349] mb-6 animate-bounce" />

      {/* Heading */}
      <h1 className="text-6xl font-bold text-[#e0f349] mb-3">404</h1>
      <p className="text-lg text-gray-200 mb-8 text-center">
        Oops! The page you’re looking for doesn’t exist.
      </p>

      {/* Home Button */}
      <button
        onClick={() => router.push("/")}
        className="px-6 py-3 rounded-xl font-medium text-gray-900 bg-[#e0f349] shadow-md hover:shadow-lg hover:scale-105 transition cursor-pointer"
      >
        Go Home
      </button>
    </div>
  );
};

export default NotFound;
