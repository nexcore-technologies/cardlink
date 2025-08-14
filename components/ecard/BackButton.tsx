"use client";

export default function BackButton() {
  return (
    <div className="absolute top-4 left-4 z-10">
      <button 
        onClick={() => window.history.back()}
        className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    </div>
  );
}
