export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center">
          {/* Company Logo Skeleton */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-gray-200 rounded-lg mx-auto animate-pulse"></div>
          </div>

          {/* Name Skeleton */}
          <div className="h-8 bg-gray-200 rounded mb-3 animate-pulse"></div>

          {/* Title Skeleton */}
          <div className="h-6 bg-gray-200 rounded mb-4 w-3/4 mx-auto animate-pulse"></div>

          {/* Company Skeleton */}
          <div className="h-6 bg-gray-200 rounded mb-6 w-1/2 mx-auto animate-pulse"></div>

          {/* Contact Information Skeletons */}
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse"></div>
            ))}
          </div>

          {/* QR Code Skeleton */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="h-4 bg-gray-200 rounded mb-3 w-1/2 mx-auto animate-pulse"></div>
            <div className="w-30 h-30 bg-gray-200 rounded-lg mx-auto animate-pulse"></div>
          </div>

          {/* Footer Skeleton */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
