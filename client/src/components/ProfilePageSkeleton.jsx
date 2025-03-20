import React from "react";
import SkeletonCard from "./SkeletonCard";


const ProfilePageSkeleton = () => {
  return (
    <div className="max-w-4xl min-h-screen mx-auto p-6 mt-16">

      <div className="bg-base-200 rounded-lg shadow-md p-6 mb-8 flex items-center">
        <div className="w-20 h-20 bg-base-300 rounded-full mr-6 animate-pulse"></div>
        <div className="flex-grow">
          <div className="h-7 bg-base-300 rounded w-48 mb-2 animate-pulse"></div>
          <div className="h-5 bg-base-300 rounded w-64 mb-3 animate-pulse"></div>
          <div className="h-5 bg-base-300 rounded w-32 animate-pulse"></div>
        </div>
      </div>

      <div>
        <div className="h-10 bg-base-300 rounded-2xl mb-6 w-full animate-pulse"></div>

        <div className="flex justify-center mb-6 overflow-x-auto">
          <div className="tabs tabs-boxed bg-base-200 p-1">
            <div className="h-8 bg-base-300 rounded w-20 mx-1 animate-pulse"></div>
            <div className="h-8 bg-base-300 rounded w-28 mx-1 animate-pulse"></div>
            <div className="h-8 bg-base-300 rounded w-32 mx-1 animate-pulse"></div>
            <div className="h-8 bg-base-300 rounded w-28 mx-1 animate-pulse"></div>
            <div className="h-8 bg-base-300 rounded w-24 mx-1 animate-pulse"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePageSkeleton;