# CardLink - Digital Business Card Platform

A modern, professional digital business card platform built with Next.js, featuring beautiful UI design, QR code generation, and seamless sharing capabilities.

## 🚀 Features

- **Modern UI Design** - Clean, professional interface with glass morphism effects
- **Digital Business Cards** - Create and customize your digital business card
- **QR Code Generation** - Automatic QR code generation for easy sharing
- **Company Profiles** - Manage company information and branding
- **Cover Images** - Optional cover images for personalized backgrounds
- **Profile Images** - Upload and manage profile pictures
- **Responsive Design** - Works perfectly on desktop and mobile devices
- **Authentication** - Secure user authentication with NextAuth.js
- **Database** - MySQL database with Prisma ORM

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS, Custom CSS
- **Authentication**: NextAuth.js
- **Database**: MySQL with Prisma ORM
- **Image Processing**: Sharp for image optimization
- **QR Codes**: qrcode library
- **Deployment**: Vercel-ready

## 📋 Prerequisites

- Node.js 18+
- MySQL database
- npm or yarn

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd cardlink
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="mysql://username:password@localhost:3306/cardlink"

# NextAuth.js
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# For production (Vercel)
VERCEL_URL="https://your-domain.vercel.app"
```

### 4. Set up the database

```bash
# Run database migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate
```

### 5. Create a test user (optional)

```bash
node scripts/create-test-user.js
```

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📱 Usage

1. **Sign up/Login** - Create an account or log in
2. **Create E-Card** - Fill in your information and upload images
3. **Customize** - Add cover images, company logos, and contact details
4. **Share** - Use the generated URL or QR code to share your card
5. **Manage** - Edit, update, or delete your cards as needed

## 🎨 Design Features

- **Glass Morphism** - Modern backdrop blur effects
- **Gradient Backgrounds** - Beautiful animated gradients
- **Smooth Animations** - Subtle hover and transition effects
- **Professional Typography** - Inter and Poppins fonts
- **Responsive Layout** - Optimized for all screen sizes

## 🔧 API Endpoints

- `POST /api/ecard` - Create new e-card
- `GET /api/ecard/user` - Get user's e-cards
- `PUT /api/ecard/[id]` - Update e-card
- `DELETE /api/ecard/[id]` - Delete e-card
- `POST /api/company` - Create company
- `GET /api/company` - Get user's companies
- `POST /api/upload` - Upload images

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set up environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set these in your Vercel dashboard:

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `VERCEL_URL`

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, email support@thenexcoretech.com or create an issue in this repository.
