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
    companyName?: string;
    companyLogo?: string;
  };
}

export default function CardPreview({ data }: CardPreviewProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-auto">
      <div className="text-center">
        {/* Company Logo */}
        {data.companyLogo && (
          <div className="mb-4">
            <Image
              src={data.companyLogo}
              alt="Company Logo"
              width={80}
              height={80}
              className="mx-auto rounded-lg object-contain"
              onError={(e) => {
                // Hide image if it fails to load
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Name */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {data.fullName || "Your Name"}
        </h2>

        {/* Title */}
        {data.title && (
          <p className="text-lg text-gray-600 mb-4">{data.title}</p>
        )}

        {/* Company */}
        {data.companyName && (
          <p className="text-sm text-gray-500 mb-4">{data.companyName}</p>
        )}

        {/* Contact Information */}
        <div className="space-y-2 text-sm">
          {data.phone && (
            <div className="flex items-center justify-center">
              <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span className="text-gray-700">{data.phone}</span>
            </div>
          )}

          {data.email && (
            <div className="flex items-center justify-center">
              <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span className="text-gray-700">{data.email}</span>
            </div>
          )}

          {data.linkedin && (
            <div className="flex items-center justify-center">
              <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700">{data.linkedin}</span>
            </div>
          )}
        </div>

        {/* Username */}
        {data.username && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              cardlink.com/u/{data.username}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
