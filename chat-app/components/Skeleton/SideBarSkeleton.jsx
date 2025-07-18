import { Users } from "lucide-react";

const SidebarSkeleton = () => {
  // Create 8 skeleton items
  const skeletonContacts = Array(8).fill(null);

  return (
    <aside
      className="h-full w-full  border-r border-base-300 
    flex flex-col transition-all duration-200 bg-[var(--dusty-bg)] text-white"
    >
      {/* Header */}
      <div className="border-b border-base-300 w-full p-5 bg-var[(--dusty-bg)]">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 " />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
      </div>

      {/* Skeleton Contacts */}
      <div className="overflow-y-auto w-full py-3 ">
        {skeletonContacts.map((_, idx) => (
          <div key={idx} className="w-full p-3 flex items-center gap-3">
            {/* Avatar skeleton */}
            <div className="relative mx-auto lg:mx-0 bg-white rounded-full animate-pulse">
              <div className="skeleton size-12 rounded-full" />
            </div>

            <div className="text-left min-w-0 flex-1 animate-pulse">
              <div className="bg-white h-4 w-32 mb-2" />
              <div className="bg-white h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;
