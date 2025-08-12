"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

export default function TestAuthPage() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      
      console.log("Sign in result:", result);
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setLoading(false);
    }
  };

  const testApiCall = async () => {
    try {
      const response = await fetch("/api/company", {
        credentials: "include",
      });
      const data = await response.json();
      console.log("API response:", data);
      alert(`API Response: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      console.error("API call error:", error);
      alert(`API Error: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Authentication Test</h1>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Session Status</h2>
          <p>Status: {status}</p>
          <p>Authenticated: {status === "authenticated" ? "Yes" : "No"}</p>
          {session && (
            <div className="mt-2 p-2 bg-gray-100 rounded">
              <pre className="text-sm">{JSON.stringify(session, null, 2)}</pre>
            </div>
          )}
        </div>

        {status === "unauthenticated" && (
          <form onSubmit={handleSignIn} className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Sign In</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </div>
          </form>
        )}

        {status === "authenticated" && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Authenticated User</h2>
            <p>Welcome, {session.user?.name || session.user?.email}!</p>
            <button
              onClick={() => signOut()}
              className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Sign Out
            </button>
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Test API Calls</h2>
          <button
            onClick={testApiCall}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Test Company API
          </button>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Debug Info</h2>
          <p>Check the browser console for detailed logs.</p>
          <p>Test user: test@example.com / password123</p>
        </div>
      </div>
    </div>
  );
}
