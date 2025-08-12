"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import CardPreview from "@/components/ecard/CardPreview";

interface ECardFormData {
  username: string;
  fullName: string;
  title: string;
  phone: string;
  email: string;
  linkedin: string;
  companyId: string;
}

interface Company {
  id: number;
  name: string;
  logoUrl: string | null;
}

interface ECard {
  id: number;
  username: string;
  fullName: string;
  title: string | null;
  phone: string | null;
  email: string | null;
  linkedin: string | null;
  companyId: number | null;
  company: Company | null;
}

export default function ECardPage() {
  const [ecards, setEcards] = useState<ECard[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ECardFormData>();

  // Watch form values for live preview
  const watchedValues = watch();

  // Fetch existing e-cards data and companies
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user's e-cards
        const ecardResponse = await fetch("/api/ecard/user", {
          credentials: "include",
        });
        if (ecardResponse.ok) {
          const ecardData = await ecardResponse.json();
          setEcards(ecardData.ecards || []);
        }

        // Fetch user's companies
        const companyResponse = await fetch("/api/company", {
          credentials: "include",
        });
        if (companyResponse.ok) {
          const companyData = await companyResponse.json();
          setCompanies(companyData.companies || []);
        }
      } catch {
        console.error("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data: ECardFormData) => {
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/ecard", {
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
        // Refresh e-cards data
        const ecardResponse = await fetch("/api/ecard/user", {
          credentials: "include",
        });
        if (ecardResponse.ok) {
          const ecardData = await ecardResponse.json();
          setEcards(ecardData.ecards || []);
        }
        // Reset form
        reset();
      } else {
        setMessage({ type: "error", text: result.error || "Failed to save e-card" });
      }
    } catch {
      setMessage({ type: "error", text: "An error occurred while saving" });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEcard = async (ecardId: number) => {
    if (!confirm("Are you sure you want to delete this e-card?")) {
      return;
    }

    try {
      const response = await fetch(`/api/ecard/${ecardId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setMessage({ type: "success", text: "E-card deleted successfully" });
        // Refresh e-cards data
        const ecardResponse = await fetch("/api/ecard/user", {
          credentials: "include",
        });
        if (ecardResponse.ok) {
          const ecardData = await ecardResponse.json();
          setEcards(ecardData.ecards || []);
        }
      } else {
        const result = await response.json();
        setMessage({ type: "error", text: result.error || "Failed to delete e-card" });
      }
    } catch {
      setMessage({ type: "error", text: "An error occurred while deleting" });
    }
  };

  // Get selected company for preview
  const selectedCompany = companies.find(c => c.id.toString() === watchedValues.companyId);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">E-Card Management</h1>
        <p className="text-gray-600">
          Create and manage your digital business cards
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-white shadow rounded-lg p-6">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  id="username"
                  {...register("username", { 
                    required: "Username is required",
                    pattern: {
                      value: /^[a-zA-Z0-9_-]+$/,
                      message: "Username can only contain letters, numbers, hyphens, and underscores"
                    }
                  })}
                  className={`w-full px-3 py-2 border rounded-md text-black shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.username ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="your-username"
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  This will be your card&apos;s URL: cardlink.com/u/your-username
                </p>
              </div>

              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  {...register("fullName", { required: "Full name is required" })}
                  className={`w-full px-3 py-2 border rounded-md text-black shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.fullName ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="John Doe"
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Job Title
              </label>
              <input
                type="text"
                id="title"
                {...register("title")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md  text-black shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Software Engineer"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  {...register("phone")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md  text-black shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  {...register("email")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md  text-black shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn Profile
              </label>
              <input
                type="url"
                id="linkedin"
                {...register("linkedin")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md  text-black shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="https://linkedin.com/in/johndoe"
              />
            </div>

            <div>
              <label htmlFor="companyId" className="block text-sm font-medium text-gray-700 mb-2">
                Company
              </label>
              <select
                id="companyId"
                {...register("companyId")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md  text-black shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">No company</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
              {companies.length === 0 && (
                <p className="mt-1 text-sm text-gray-500">
                  <a href="/dashboard/company" className="text-indigo-600 hover:text-indigo-500">
                    Create a company profile
                  </a>{" "}
                  to link with your e-card
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="px-4 py-2 border border-gray-300 rounded-md  text-black shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {saving ? "Creating..." : "Create E-Card"}
              </button>
            </div>
          </form>
        </div>

        {/* Preview Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Live Preview</h3>
          <CardPreview
            data={{
              username: watchedValues.username || "",
              fullName: watchedValues.fullName || "",
              title: watchedValues.title || "",
              phone: watchedValues.phone || "",
              email: watchedValues.email || "",
              linkedin: watchedValues.linkedin || "",
              companyName: selectedCompany?.name || "",
              companyLogo: selectedCompany?.logoUrl || "",
            }}
          />
        </div>
      </div>

      {/* E-Cards List */}
      {ecards.length > 0 && (
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Your E-Cards</h3>
          <div className="space-y-4">
            {ecards.map((ecard) => (
              <div key={ecard.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-medium text-gray-900">{ecard.fullName}</h4>
                      <span className="text-sm text-gray-500">@{ecard.username}</span>
                    </div>
                    {ecard.title && (
                      <p className="text-sm text-gray-600 mt-1">{ecard.title}</p>
                    )}
                    {ecard.company && (
                      <p className="text-sm text-gray-600 mt-1">at {ecard.company.name}</p>
                    )}
                    <div className="mt-3 flex items-center space-x-4">
                      <a
                        href={`/u/${ecard.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                      >
                        View Public E-Card
                      </a>
                      <a
                        href={`/api/ecard/qr/${ecard.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Get QR Code
                      </a>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      URL: <code className="bg-gray-100 px-1 py-0.5 rounded">cardlink.com/u/{ecard.username}</code>
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteEcard(ecard.id)}
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

      {ecards.length === 0 && (
        <div className="mt-8 bg-white shadow rounded-lg p-6 text-center text-gray-500">
          <p>No e-cards created yet. Create your first e-card above.</p>
        </div>
      )}
    </div>
  );
}
