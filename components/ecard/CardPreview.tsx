"use client";

import Image from "next/image";

interface CardPreviewProps {
  data: {
    username: string;
    fullName: string;
    title: string;
    phone: string;
    email: string;
    linkedin: string;
    profileImage?: string;
    companyName?: string;
    companyLogo?: string;
    coverImage?: string;
  };
}

export default function CardPreview({ data }: CardPreviewProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg max-w-md w-full overflow-hidden">
      {/* Profile Section - Matching public e-card UI */}
      <div className="relative">
        {/* Banner/Cover Image */}
        <div className="h-32 bg-gradient-to-r from-gray-100 to-gray-200 relative">
          {data.coverImage ? (
            <Image
              src={data.coverImage}
              alt="Cover"
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 opacity-80"></div>
          )}
         
        </div>
        
        {/* Profile Picture and Info */}
        <div className="px-6 pb-6 relative">
          <div className="flex items-start space-x-4 -mt-16 relative z-10">
            {/* Profile Picture */}
            <div className="flex-shrink-0">
              {data.profileImage ? (
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white">
                  <Image
                    src={data.profileImage}
                    alt={data.fullName || "Profile"}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <span className="text-2xl font-bold text-white">
                    {(data.fullName || "A").charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Company Logo */}
            {data.companyLogo && (
              <div className="flex-shrink-0 ml-auto">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-white shadow-lg border-2 border-white">
                  <Image
                    src={data.companyLogo}
                    alt={data.companyName || "Company"}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>
              </div>
            )}
          </div>

          {/* Name and Title */}
          <div className="mt-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {data.fullName || "Your Name"}
            </h1>
            <p className="text-gray-500 text-sm">@{data.username || "username"}</p>
            {data.title && (
              <p className="text-lg text-gray-700 mt-1">
                {data.title}
              </p>
            )}
            {data.companyName && (
              <p className="text-md text-gray-600 mt-1">
                {data.companyName}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="px-6 pb-6 space-y-3">
        {data.email && (
          <div className="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500">Work</p>
              <span className="text-gray-900 font-medium">{data.email}</span>
            </div>
          </div>
        )}

        {data.phone && (
          <div className="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500">Mobile</p>
              <span className="text-gray-900 font-medium">{data.phone}</span>
            </div>
          </div>
        )}

        {data.linkedin && (
          <div className="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500">LinkedIn</p>
              <span className="text-gray-900 font-medium">View Profile</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center">
          {data.username ? `cardlink.com/u/${data.username}` : "Preview"}
        </p>
      </div>
    </div>
  );
}
