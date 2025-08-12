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
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CompanyFormData>();

  // Fetch existing company data
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await fetch("/api/company");
        if (response.ok) {
          const data = await response.json();
          if (data.company) {
            setCompany(data.company);
            // Pre-fill form with existing data
            setValue("name", data.company.name);
            setValue("logoUrl", data.company.logoUrl || "");
            setValue("website", data.company.website || "");
            setValue("contact", data.company.contact || "");
          }
        }
              } catch {
          console.error("Error fetching company");
        } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [setValue]);

  const onSubmit = async (data: CompanyFormData) => {
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/company", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: result.message });
        // Refresh company data
        const companyResponse = await fetch("/api/company");
        if (companyResponse.ok) {
          const companyData = await companyResponse.json();
          if (companyData.company) {
            setCompany(companyData.company);
          }
        }
      } else {
        setMessage({ type: "error", text: result.error || "Failed to save company" });
      }
    } catch {
      setMessage({ type: "error", text: "An error occurred while saving" });
    } finally {
      setSaving(false);
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
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Company Profile</h1>
          <p className="text-gray-600">
            {company ? "Update your company information" : "Add your company information"}
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Company Name *
            </label>
            <input
              type="text"
              id="name"
              {...register("name", { required: "Company name is required" })}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="+1 (555) 123-4567"
            />
            <p className="mt-1 text-sm text-gray-500">
              Enter your company contact number
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {saving ? "Saving..." : company ? "Update Company" : "Create Company"}
            </button>
          </div>
        </form>

        {company && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Current Company Information</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div>
                <span className="font-medium text-gray-700">Name:</span> {company.name}
              </div>
              {company.logoUrl && (
                <div>
                  <span className="font-medium text-gray-700">Logo:</span>{" "}
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
              {company.website && (
                <div>
                  <span className="font-medium text-gray-700">Website:</span>{" "}
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
                  <span className="font-medium text-gray-700">Contact:</span> {company.contact}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
