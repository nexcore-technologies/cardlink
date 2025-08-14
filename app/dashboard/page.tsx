import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await getServerSession();
  
  // Fetch user's company and e-card if they have one
  let company = null;
  let ecard = null;
  if (session?.user?.id) {
    const userId = parseInt(session.user.id);
    
    [company, ecard] = await Promise.all([
      prisma.company.findFirst({
        where: {
          ownerId: userId,
        },
      }),
      prisma.eCard.findFirst({
        where: {
          ownerId: userId,
        },
      }),
    ]);
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="relative z-10 max-w-6xl mx-auto p-6">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 font-display animate-fade-in">
            Welcome back, {session?.user?.name || 'User'}!
          </h1>
          <p className="text-xl text-gray-600 font-light animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Your digital business card dashboard
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2 font-display">E-Cards</h3>
            <p className="text-4xl font-bold text-blue-600 mb-2">
              {ecard ? "1" : "0"}
            </p>
            <p className="text-gray-600 mb-4">
              {ecard ? "Card created" : "No cards created"}
            </p>
            <a
              href="/dashboard/ecard"
              className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {ecard ? "Edit E-Card" : "Create E-Card"}
            </a>
          </div>
          
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2 font-display">Views</h3>
            <p className="text-4xl font-bold text-green-600 mb-2">
              {ecard?.views || 0}
            </p>
            <p className="text-gray-600">Total card views</p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2 font-display">Company</h3>
            <p className="text-4xl font-bold text-indigo-600 mb-2">
              {company ? "✓" : "-"}
            </p>
            <p className="text-gray-600 mb-4">
              {company ? company.name : "No company profile"}
            </p>
            <a
              href="/dashboard/company"
              className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {company ? "Edit Company" : "Add Company"}
            </a>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in" style={{ animationDelay: '1s' }}>
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-display">Quick Actions</h2>
            <div className="space-y-4">
              <a
                href="/dashboard/ecard"
                className="flex items-center p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Create New E-Card</h3>
                  <p className="text-sm text-gray-600">Design your digital business card</p>
                </div>
              </a>
              
              <a
                href="/dashboard/company"
                className="flex items-center p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Manage Companies</h3>
                  <p className="text-sm text-gray-600">Update company profiles</p>
                </div>
              </a>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-display">Account Info</h2>
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-gray-50 rounded-2xl">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{session?.user?.name || "User"}</h3>
                  <p className="text-sm text-gray-600">{session?.user?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
