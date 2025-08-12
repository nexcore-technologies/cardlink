import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await getServerSession();
  
  // Fetch user's company if they have one
  let company = null;
  if (session?.user?.id) {
    company = await prisma.company.findUnique({
      where: {
        ownerId: parseInt(session.user.id),
      },
    });
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to your dashboard</p>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h2 className="text-lg font-semibold text-blue-900 mb-2">User Information</h2>
        <div className="space-y-2 text-sm text-blue-800">
          <p><strong>Email:</strong> {session?.user?.email}</p>
          <p><strong>Name:</strong> {session?.user?.name || "Not provided"}</p>
          <p><strong>User ID:</strong> {session?.user?.id}</p>
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">ECards</h3>
          <p className="text-2xl font-bold text-indigo-600">0</p>
          <p className="text-sm text-gray-500">Total cards created</p>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Views</h3>
          <p className="text-2xl font-bold text-green-600">0</p>
          <p className="text-sm text-gray-500">Total card views</p>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Company</h3>
          <p className="text-2xl font-bold text-purple-600">
            {company ? "✓" : "-"}
          </p>
          <p className="text-sm text-gray-500">
            {company ? company.name : "No company profile"}
          </p>
          <a
            href="/dashboard/company"
            className="mt-2 inline-block text-sm text-indigo-600 hover:text-indigo-500"
          >
            {company ? "Edit Company" : "Add Company"}
          </a>
        </div>
      </div>
    </div>
  );
}
