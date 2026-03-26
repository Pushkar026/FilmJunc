import React from "react";

interface SkeletonLoaderProps {
  count?: number;
  type?: "card" | "profile" | "message" | "text";
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  count = 3,
  type = "card",
}) => {
  if (type === "card") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className="bg-gray-800 rounded-2xl p-4 animate-pulse shadow-lg"
          >
            <div className="w-32 h-32 mx-auto bg-gray-700 rounded-full"></div>
            <div className="h-4 bg-gray-700 mt-4 rounded w-3/4 mx-auto"></div>
            <div className="h-3 bg-gray-700 mt-3 rounded w-1/2 mx-auto"></div>
            <div className="h-3 bg-gray-700 mt-2 rounded w-2/3 mx-auto"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "profile") {
    return (
      <div className="animate-pulse">
        <div className="h-48 w-full bg-gray-700 rounded-lg mb-4"></div>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-32 h-32 bg-gray-700 rounded-full"></div>
          <div className="flex-1">
            <div className="h-8 bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "message") {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="flex gap-3 animate-pulse">
            <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="h-4 bg-gray-700 rounded w-full"></div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
