"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ui/ImageUpload";

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
  const [companyLogo, setCompanyLogo] = useState<string>("");
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CompanyFormData>();

  // Fetch existing companies data
  useEffect(() => {
    const fetchData = async () => {
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

    fetchData();
  }, []);

  const onSubmit = async (data: CompanyFormData) => {
    setSaving(true);
    setMessage(null);

    try {
      const requestData = {
        ...data,
        logoUrl: companyLogo,
      };

      const url = isEditMode && editingCompany 
        ? `/api/company/${editingCompany.id}` 
        : "/api/company";
      
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: result.message });
        // Reset form
        reset();
        setCompanyLogo("");
        
        // Exit edit mode if we were editing
        if (isEditMode) {
          setEditingCompany(null);
          setIsEditMode(false);
        }

        // Refresh companies data
        const refreshResponse = await fetch("/api/company", {
          credentials: "include",
        });
        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          setCompanies(refreshData.companies || []);
        }
      } else {
        setMessage({ type: "error", text: result.error || "Failed to save company" });
      }
    } catch (error) {
      console.error("Error saving company:", error);
      setMessage({ type: "error", text: "An error occurred while saving" });
    } finally {
      setSaving(false);
    }
  };

  const handleEditCompany = (company: Company) => {
    setEditingCompany(company);
    setIsEditMode(true);
    
    // Populate form with existing data
    reset({
      name: company.name,
      logoUrl: company.logoUrl || "",
      website: company.website || "",
      contact: company.contact || "",
    });
    
    setCompanyLogo(company.logoUrl || "");
  };

  const handleCancelEdit = () => {
    setEditingCompany(null);
    setIsEditMode(false);
    reset();
    setCompanyLogo("");
  };

  const handleDeleteCompany = async (companyId: number) => {
    if (!confirm("Are you sure you want to delete this company? This will also remove it from any linked e-cards.")) {
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
        const refreshResponse = await fetch("/api/company", {
          credentials: "include",
        });
        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          setCompanies(refreshData.companies || []);
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Company Management</h1>
        <p className="text-gray-600">
          Create and manage your company profiles
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              {isEditMode ? "Edit Company" : "Create New Company"}
            </h2>
            {isEditMode && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel Edit
              </button>
            )}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-black shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Your Company Name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Logo
              </label>
              <ImageUpload
                onImageUpload={setCompanyLogo}
                currentImage={companyLogo}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  id="website"
                  {...register("website")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-black shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Number
                </label>
                <input
                  type="tel"
                  id="contact"
                  {...register("contact")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-black shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="px-4 py-2 border border-gray-300 rounded-md text-black shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {saving 
                  ? (isEditMode ? "Updating..." : "Creating...") 
                  : (isEditMode ? "Update Company" : "Create Company")
                }
              </button>
            </div>
          </form>
        </div>

        {/* Companies List */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Your Companies</h3>
          {companies.length > 0 ? (
            <div className="space-y-4">
              {companies.map((company) => (
                <div key={company.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        {company.logoUrl && (
                          <img
                            src={company.logoUrl}
                            alt={company.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <h4 className="font-medium text-gray-900">{company.name}</h4>
                          {company.website && (
                            <a
                              href={company.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-800"
                            >
                              {company.website}
                            </a>
                          )}
                        </div>
                      </div>
                      {company.contact && (
                        <p className="text-sm text-gray-600 mt-1">{company.contact}</p>
                      )}
                      <div className="mt-3 flex items-center space-x-4">
                        <button
                          onClick={() => handleEditCompany(company)}
                          className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCompany(company.id)}
                          className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <p>No companies created yet. Create your first company above.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
