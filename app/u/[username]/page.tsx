import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { Metadata } from "next";
import QRCode from "qrcode";
import BackButton from "@/components/ecard/BackButton";

interface ECardPageProps {
  params: Promise<{
    username: string;
  }>;
}

export async function generateMetadata({ params }: ECardPageProps): Promise<Metadata> {
  const { username } = await params;
  
  const ecard = await prisma.eCard.findUnique({
    where: { username },
    include: { company: true },
  });

  if (!ecard) {
    return {
      title: 'E-Card Not Found',
    };
  }

  return {
    title: `${ecard.fullName} - Digital Business Card`,
    description: `${ecard.fullName}${ecard.title ? ` - ${ecard.title}` : ''}${ecard.company?.name ? ` at ${ecard.company.name}` : ''}`,
    openGraph: {
      title: `${ecard.fullName} - Digital Business Card`,
      description: `${ecard.fullName}${ecard.title ? ` - ${ecard.title}` : ''}${ecard.company?.name ? ` at ${ecard.company.name}` : ''}`,
      type: 'website',
    },
  };
}

export default async function ECardPage({ params }: ECardPageProps) {
  const { username } = await params;

  // Fetch the e-card data
  const ecard = await prisma.eCard.findUnique({
    where: {
      username: username,
    },
    include: {
      company: true,
      owner: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  if (!ecard) {
    notFound();
  }

  // Increment view count and ensure QR code exists
  await prisma.eCard.update({
    where: {
      id: ecard.id,
    },
    data: {
      views: {
        increment: 1,
      },
      // Generate QR code if it doesn't exist
      ...(ecard.qrCodeUrl ? {} : {
        qrCodeUrl: await QRCode.toDataURL(`${process.env.NEXTAUTH_URL || process.env.VERCEL_URL || 'http://localhost:3000'}/u/${username}`)
      }),
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="px-4 py-6">
        <BackButton />
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-2xl shadow-lg max-w-md w-full overflow-hidden">
          {/* Profile Section - Inspired by the attached profile cards */}
          <div className="relative">
                    {/* Banner Image */}
        <div className="h-32 bg-gradient-to-r from-gray-100 to-gray-200 relative">
          {ecard.coverImage ? (
            <Image
              src={ecard.coverImage}
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
                  {ecard.profileImage ? (
                    <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white">
                      <Image
                        src={ecard.profileImage}
                        alt={ecard.fullName}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                      <span className="text-2xl font-bold text-white">
                        {ecard.fullName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Company Logo */}
                {ecard.company?.logoUrl && (
                  <div className="flex-shrink-0 ml-auto">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-white shadow-lg border-2 border-white">
                      <Image
                        src={ecard.company.logoUrl}
                        alt={ecard.company.name}
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
                  {ecard.fullName}
                </h1>
                <p className="text-gray-500 text-sm">@{ecard.username}</p>
                {ecard.title && (
                  <p className="text-lg text-gray-700 mt-1">
                    {ecard.title}
                  </p>
                )}
                {ecard.company?.name && (
                  <p className="text-md text-gray-600 mt-1">
                    {ecard.company.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="px-6 pb-6 space-y-3">
            {ecard.email && (
              <div className="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Work</p>
                  <a href={`mailto:${ecard.email}`} className="text-gray-900 font-medium">
                    {ecard.email}
                  </a>
                </div>
              </div>
            )}

            {ecard.phone && (
              <div className="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Mobile</p>
                  <a href={`tel:${ecard.phone}`} className="text-gray-900 font-medium">
                    {ecard.phone}
                  </a>
                </div>
              </div>
            )}

            {ecard.company?.website && (
              <div className="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Website</p>
                  <a 
                    href={ecard.company.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-900 font-medium"
                  >
                    {ecard.company.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              </div>
            )}

            {ecard.linkedin && (
              <div className="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">LinkedIn</p>
                  <a 
                    href={ecard.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-900 font-medium"
                  >
                    View Profile
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* QR Code Section */}
          {ecard.qrCodeUrl && (
            <div className="px-6 pb-6 border-t border-gray-100 pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-3">Scan to save contact</p>
                <div className="flex justify-center">
                  <Image
                    src={ecard.qrCodeUrl}
                    alt="QR Code"
                    width={100}
                    height={100}
                    className="rounded-lg"
                    unoptimized
                  />
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center">
              Powered by NEXCORE Technology Solutions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
