"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

interface CompanyFormData {
  name: string;
  logoUrl: string;
  website: string;
  contact: string;
}

interface Company {
  id: number;
  name: string;
  logoUrl: string | null;
  website: string | null;
  contact: string | null;
}

export default function CompanyPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CompanyFormData>();

  // Fetch existing companies data
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch("/api/company", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setCompanies(data.companies || []);
        }
      } catch {
        console.error("Error fetching companies");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const onSubmit = async (data: CompanyFormData) => {
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/company", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: result.message });
        // Refresh companies data
        const companiesResponse = await fetch("/api/company", {
          credentials: "include",
        });
        if (companiesResponse.ok) {
          const companiesData = await companiesResponse.json();
          setCompanies(companiesData.companies || []);
        }
        // Reset form
        reset();
      } else {
        setMessage({ type: "error", text: result.error || "Failed to save company" });
      }
    } catch {
      setMessage({ type: "error", text: "An error occurred while saving" });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCompany = async (companyId: number) => {
    if (!confirm("Are you sure you want to delete this company?")) {
      return;
    }

    try {
      const response = await fetch(`/api/company/${companyId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Company deleted successfully" });
        // Refresh companies data
        const companiesResponse = await fetch("/api/company", {
          credentials: "include",
        });
        if (companiesResponse.ok) {
          const companiesData = await companiesResponse.json();
          setCompanies(companiesData.companies || []);
        }
      } else {
        const result = await response.json();
        setMessage({ type: "error", text: result.error || "Failed to delete company" });
      }
    } catch {
      setMessage({ type: "error", text: "An error occurred while deleting" });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Company Management</h1>
          <p className="text-gray-600">
            Create and manage your company profiles
          </p>
        </div>

        {message && (
          <div
            className={`mb-4 p-4 rounded-md ${
              message.type === "success"
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mb-8">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Company Name *
            </label>
            <input
              type="text"
              id="name"
              {...register("name", { required: "Company name is required" })}
              className={`w-full px-3 py-2 border text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.name ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter company name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Logo URL
            </label>
            <input
              type="url"
              id="logoUrl"
              {...register("logoUrl")}
              className="w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="https://example.com/logo.png"
            />
            <p className="mt-1 text-sm text-gray-500">
              Enter the URL of your company logo
            </p>
          </div>

          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
              Website
            </label>
            <input
              type="url"
              id="website"
              {...register("website")}
              className="w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="https://example.com"
            />
            <p className="mt-1 text-sm text-gray-500">
              Enter your company website URL
            </p>
          </div>

          <div>
            <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-2">
              Contact Number
            </label>
            <input
              type="tel"
              id="contact"
              {...register("contact")}
              className="w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="+233 24 123 4567"
            />
            <p className="mt-1 text-sm text-gray-500">
              Enter your company contact number
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="px-4 py-2 border border-gray-300 text-black rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 border border-transparent text-black rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {saving ? "Creating..." : "Create Company"}
            </button>
          </div>
        </form>

        {/* Companies List */}
        {companies.length > 0 && (
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Your Companies</h3>
            <div className="space-y-4">
              {companies.map((company) => (
                <div key={company.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{company.name}</h4>
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        {company.website && (
                          <div>
                            <span className="font-medium">Website:</span>{" "}
                            <a
                              href={company.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:text-indigo-500"
                            >
                              {company.website}
                            </a>
                          </div>
                        )}
                        {company.contact && (
                          <div>
                            <span className="font-medium">Contact:</span> {company.contact}
                          </div>
                        )}
                        {company.logoUrl && (
                          <div>
                            <span className="font-medium">Logo:</span>{" "}
                            <a
                              href={company.logoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:text-indigo-500"
                            >
                              {company.logoUrl}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteCompany(company.id)}
                      className="ml-4 px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {companies.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No companies created yet. Create your first company above.</p>
          </div>
        )}
      </div>
    </div>
  );
}
