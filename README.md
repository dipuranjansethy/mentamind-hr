# Mentamind Corporate Wellness Suite

A comprehensive corporate wellness platform designed to reduce burnout, improve productivity, and create a culture of well-being in organizations.

## Overview

Mentamind's Corporate Wellness Suite is a two-sided platform:

- **HR/Admin Dashboard**: Analytics, management, and workforce wellness insights
- **Employee Wellness App**: Private, stigma-free, personalized wellness tools

This platform helps organizations improve employee well-being, reduce burnout, and create a healthier workplace culture.

## Features

### HR/Admin Dashboard

- **Wellness Analytics Dashboard**: Organization-wide wellness index, heatmaps, burnout risk indicators
- **Employee Management**: Bulk onboarding, role-based access
- **Reports & Insights**: Customizable reports by department/location, attrition correlation, absenteeism patterns
- **Campaigns**: Push wellness reminders, surveys, challenges
- **Admin Tools**: Billing, subscription management, access control

### Employee Wellness App

- **Well-being Tracking & Support**:
  - AI Chatbot (24/7 confidential support)
  - Mood & Symptom Tracker + Personal Wellness Score
  - Burnout Risk Alerts & Private Nudges

- **Wellness Programs**:
  - 12-week structured program (stress management, focus, sleep, resilience)
  - Gamified progression (badges, streaks)
  - Personalized AI wellness paths

- **Guided Meditation & Journaling**:
  - Meditation (focus, sleep, mindfulness, pre-meeting calm)
  - Journaling with guided prompts & voice-to-text option
  - Gratitude & reflection challenges

- **Community & Engagement**:
  - Anonymous peer groups (stress, parenting, grief, work-life balance)
  - Corporate-wide challenges

## Tech Stack

- **Frontend**: Next.js with TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Authentication**: JWT-based authentication
- **Hosting**: Vercel/AWS/GCP

## Prerequisites

- Node.js 18.x or higher
- MongoDB instance (local or cloud-based like MongoDB Atlas)
- npm or yarn

## Getting Started

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/mentamind-hr-pannel.git
cd mentamind-hr-pannel
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory with the following variables:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### Building for Production

```bash
npm run build
# or
yarn build
```

### Running in Production Mode

```bash
npm start
# or
yarn start
```

## Project Structure

```
├── public/                 # Static assets
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── api/            # API routes
│   │   ├── auth/           # Authentication pages
│   │   ├── dashboard/      # HR/Admin dashboard pages
│   │   ├── employee/       # Employee app pages
│   │   └── page.tsx        # Landing page
│   ├── components/         # React components
│   │   ├── auth/           # Authentication components
│   │   ├── dashboard/      # Dashboard components
│   │   ├── employee/       # Employee app components
│   │   └── ui/             # Shared UI components
│   ├── lib/                # Utility functions
│   │   ├── jwt.ts          # JWT authentication utilities
│   │   └── mongodb.ts      # MongoDB connection utility
│   └── models/             # MongoDB models
├── .env.local              # Environment variables (create this file)
├── next.config.ts          # Next.js configuration
├── package.json            # Project dependencies
└── tsconfig.json           # TypeScript configuration
```

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user/company
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user profile

### Employee Endpoints

- `GET /api/employee/wellness` - Get wellness data for current user
- `POST /api/employee/wellness` - Create/update wellness data entry
- `GET /api/employee/programs` - Get wellness programs
- `GET /api/employee/programs/:id` - Get specific program details
- `POST /api/employee/programs/:id` - Start or update program progress
- `GET /api/employee/journal` - Get journal entries
- `POST /api/employee/journal` - Create journal entry
- `GET /api/employee/journal/:id` - Get specific journal entry
- `PUT /api/employee/journal/:id` - Update journal entry
- `DELETE /api/employee/journal/:id` - Delete journal entry

### Admin Endpoints

- `GET /api/admin/analytics` - Get company-wide analytics

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Mentamind Team - contact@mentamind.com

---

Built with ❤️ by the Mentamind Team
