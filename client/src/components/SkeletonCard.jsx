import React from "react";

const SkeletonCard = () => {
  return (
    <div className="rounded-xl bg-base-300 animate-pulse overflow-hidden">
      <div className="h-3 bg-base-100 rounded-full w-3/4 mx-auto mt-6 mb-4"></div>
      <div className="h-6 bg-base-100 rounded-full w-5/6 mx-auto mb-4"></div>
      <div className="h-24 bg-base-100 rounded-lg mx-4 mb-4"></div>
      <div className="flex justify-between p-4">
        <div className="h-8 bg-base-100 rounded-lg w-24"></div>
        <div className="h-8 bg-base-100 rounded-lg w-24"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
