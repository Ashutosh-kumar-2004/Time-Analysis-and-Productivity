// components/profile/ProfileShimmer.jsx

export default function ProfileShimmer() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl space-y-4 sm:space-y-6 animate-pulse">
        {/* Profile Header */}
        <div className="rounded-2xl bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-gray-300 dark:bg-gray-600" />

          {/* Profile Info */}
          <div className="flex-1 space-y-2 sm:space-y-3">
            <div className="h-5 sm:h-6 w-1/2 bg-gray-300 dark:bg-gray-600 rounded" />
            <div className="h-4 sm:h-5 w-1/3 bg-gray-300 dark:bg-gray-600 rounded" />
            <div className="flex gap-2 mt-2">
              <div className="h-8 w-24 bg-gray-300 dark:bg-gray-600 rounded" />
              <div className="h-8 w-24 bg-gray-300 dark:bg-gray-600 rounded" />
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-col gap-2 text-center sm:text-right">
            <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded mx-auto sm:mx-0" />
            <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded mx-auto sm:mx-0" />
          </div>
        </div>

        {/* Tabs */}
        <div className="rounded-2xl bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 p-2 shadow-sm">
          <div className="flex gap-2">
            <div className="h-10 w-24 bg-gray-300 dark:bg-gray-600 rounded" />
            <div className="h-10 w-24 bg-gray-300 dark:bg-gray-600 rounded" />
            <div className="h-10 w-24 bg-gray-300 dark:bg-gray-600 rounded" />
          </div>
        </div>

        {/* Content Area */}
        <div className="rounded-2xl bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 p-4 sm:p-6 space-y-4">
          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-4">
              <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
              <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-2/4" />
              <div className="h-20 bg-gray-300 dark:bg-gray-600 rounded" />
            </div>
            <div className="space-y-4">
              <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
              <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-2/4" />
              <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-1/2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
