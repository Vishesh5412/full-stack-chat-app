export default function ChatSkeleton() {
  const skeletonMessages = Array(3).fill(null);
  return (
    <div className="h-full w-full flex flex-col justify-between bg-[var(--dusty-bg)] ">
      {/* Header Skeleton */}
      <div className="p-4  shadow-md flex gap-2">
        <div className="h-10 w-10 bg-gray-300 rounded animate-pulse rounded-full"></div>
        <div className="flex flex-col gap-1">
          <div className="h-5 w-[120px] bg-gray-300  animate-pulse"></div>
          <div className="h-4 w-12 bg-gray-300  animate-pulse"></div>
        </div>
      </div>

      <div>
        {skeletonMessages.map((_, idx) => (
          <div key={idx}>
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              
              <div className="flex items-start space-x-3 ">
                <div className=" bg-gray-300 h-10 w-32  rounded-e-xl rounded-es-xl animate-pulse"></div>
              </div>

              <div className="flex justify-end space-x-3">
                <div className="bg-gray-300 h-10 w-32 rounded-s-xl rounded-t-xl animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Skeleton */}
      <div className="p-4 shadow-md">
        <div className="flex items-center space-x-2">
          <div className="flex-1 h-10 border rounded-full animate-pulse"></div>
          <div className="w-16 h-10 bg-gray-300 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}



