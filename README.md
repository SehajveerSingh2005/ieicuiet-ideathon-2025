# Cre'oVate 2025 - Ideathon Voting Platform

Igniting Creativity, Driving Innovations - Join the most innovative ideathon event of 2025. Register your team, present your ideas, and vote for the best projects. Powered by cutting-edge technology and creative minds.
## Table of Contents

- [Key Features](#key-features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Key Features

- **Team Registration**: Teams can register for the ideathon event with project details
- **Admin Dashboard**: Comprehensive admin controls for managing teams, votes, and event settings
- **Real-time Voting**: Dynamic voting system with live updates during presentations
- **Leaderboard**: Real-time ranking of teams based on votes received
- **Firebase Integration**: Secure authentication and real-time database powered by Firebase
- **Responsive Design**: Fully responsive UI that works on all devices
- **Voting Controls**: Admin can start/stop voting sessions and manage presentation flow
- **Team Management**: Admin can add, edit, or remove teams from the event
- **Vote Management**: Admin can view, edit, or delete votes as needed

## Technologies Used

- [Next.js 15](https://nextjs.org/) - React framework for production
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript for better development experience
- [Firebase](https://firebase.google.com/) - Backend services including authentication and Firestore database
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Shadcn UI](https://ui.shadcn.com/) - Reusable component library built with Radix UI and Tailwind CSS
- [Lucide Icons](https://lucide.dev/) - Beautiful and consistent icon set

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js) or [yarn](https://yarnpkg.com/)
- Firebase account and project setup
- Git (for version control)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/ideathon-voting-app.git
   ```

2. Navigate to the project directory:
   ```bash
   cd ideathon-voting-app
   ```

3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

4. Create a `.env.local` file in the root directory and add the required environment variables (see [Environment Variables](#environment-variables) section).

5. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

To run this project, you will need to add the following environment variables to your `.env.local` file:

```env
# Node Environment
NODE_ENV=development

# Firebase Client Config
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# Firebase Admin Config
FIREBASE_ADMIN_PROJECT_ID=your_firebase_admin_project_id
FIREBASE_ADMIN_CLIENT_EMAIL=your_firebase_admin_client_email
FIREBASE_ADMIN_PRIVATE_KEY=your_firebase_admin_private_key

# Admin Credentials
NEXT_PUBLIC_ADMIN_EMAIL=admin@example.com
NEXT_PUBLIC_ADMIN_PASSWORD=your_admin_password
```

**Note**: Replace the placeholder values with your actual Firebase configuration and admin credentials.

## Available Scripts

In the project directory, you can run:

### `npm run dev` or `yarn dev`

Runs the app in the development mode.  
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.  
You will also see any lint errors in the console.

### `npm run build` or `yarn build`

Builds the app for production to the `build` folder.  
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.  
Your app is ready to be deployed!

### `npm run start` or `yarn start`

Runs the built app in production mode.

### `npm run lint` or `yarn lint`

Runs the ESLint linter to check for code quality issues.

## Project Structure

```
ideathon-voting-app/
├── app/                          # Next.js app directory
│   ├── admin/                   # Admin dashboard pages
│   │   └── login/               # Admin login page
│   ├── api/                     # API routes
│   │   └── admin/               # Admin API routes
│   ├── components/              # React components
│   │   ├── admin/               # Admin-specific components
│   │   ├── leaderboard/         # Leaderboard components
│   │   ├── ui/                  # Reusable UI components
│   │   ├── voting/              # Voting components
│   │   └── Firebase components  # Firebase related components
│   ├── context/                 # React context providers
│   ├── leaderboard/             # Leaderboard pages
│   ├── login/                   # User login pages
│   ├── register/                # Team registration pages
│   └── vote/                    # Voting pages
├── lib/                         # Utility functions and Firebase config
├── public/                      # Static assets
├── .env.local                   # Environment variables
├── next.config.ts               # Next.js configuration
├── package.json                 # Project dependencies and scripts
├── tailwind.config.ts           # Tailwind CSS configuration
└── tsconfig.json                # TypeScript configuration
```

## Deployment

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### Environment Variables for Production

When deploying to production, make sure to set the same environment variables in your deployment platform:

- `NODE_ENV=production`
- All Firebase configuration variables
- Admin credentials

### Firebase Deployment

This application uses Firebase for authentication and database. Make sure your Firebase project is properly configured:

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password method)
3. Enable Firestore Database
4. Add your domain to the authorized domains list

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure your code follows the existing style and includes appropriate tests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

MIT License

Copyright (c) 2025 Cre'oVate Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Conclusion

The Cre'oVate 2025 Ideathon Voting Platform is a comprehensive solution for managing ideathon events with real-time voting capabilities. Built with modern web technologies, it provides a seamless experience for participants, organizers, and administrators.

Whether you're hosting a small team competition or a large-scale innovation event, this platform offers the tools and flexibility needed to ensure a successful voting process.

For any questions or support, please contact the development team.
