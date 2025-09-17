# StackMatch Dashboard

A comprehensive dashboard application built with Next.js 15, TypeScript, and modern web technologies. StackMatch Dashboard provides a powerful platform for managing environments, user profiles, analytics, and more.

## ✨ Features

- 🔐 **Authentication & Authorization** - Complete auth system with profile management
- 👥 **User Management** - User profiles with avatar uploads and settings
- 🏗️ **Environment Management** - Create, edit, and manage development environments
- 📊 **Analytics Dashboard** - Comprehensive analytics and insights
- 🎨 **Modern UI** - Built with Radix UI components and Tailwind CSS
- 🌓 **Dark/Light Mode** - Theme switching with system preference detection
- 📱 **Responsive Design** - Optimized for all device sizes
- ⚡ **Performance** - Optimized with Next.js 15 App Router and server components

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom animations
- **UI Components**: [Radix UI](https://www.radix-ui.com/) primitives
- **Database**: [Supabase](https://supabase.com/) with SSR support
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animation**: [Motion](https://motion.dev/)
- **Development**: ESLint, PostCSS, and TypeScript compiler

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- npm, yarn, pnpm, or bun package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd stackmatch-dashboard
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Configure your Supabase credentials and other environment variables.

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📂 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main dashboard
│   ├── environments/      # Environment management
│   ├── profile/           # User profile pages
│   ├── analytics/         # Analytics dashboard
│   └── settings/          # Application settings
├── components/            # Reusable React components
│   ├── ui/               # UI primitives (Radix-based)
│   ├── magicui/          # Custom UI components
│   └── docs/             # Documentation components
└── lib/                  # Utility libraries
    ├── supabase/         # Supabase client configuration
    └── utils.ts          # Utility functions
```

## 🎯 Key Features

### Authentication
- Secure user authentication with Supabase
- Profile completion flow
- Password reset functionality
- Session management with SSR support

### Dashboard
- Interactive dashboard with real-time data
- Environment overview and management
- User analytics and insights
- Responsive card-based layout

### Environment Management
- Create and configure development environments
- Environment comparison tools
- Public and private environment listings
- Environment editing and version control

### User Experience
- Smooth animations and transitions
- Loading states and progress indicators
- Toast notifications for user feedback
- Accessible design with keyboard navigation

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality

## 🌐 Deployment

### Vercel (Recommended)

The easiest way to deploy is using the [Vercel Platform](https://vercel.com/new):

1. Push your code to a Git repository
2. Import your project on Vercel
3. Configure environment variables
4. Deploy!

### Other Platforms

This application can be deployed on any platform that supports Node.js:

- **Netlify**: Build command `npm run build`, publish directory `out`
- **Railway**: Automatic deployment from Git
- **Docker**: Use the provided Dockerfile (if available)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the terms specified in the LICENSE file.

## 🆘 Support

For support and questions:
- Check the documentation in the `/src/components/docs` directory
- Review the code examples in the components
- Open an issue for bug reports or feature requests

---

Built with ❤️ using Next.js and modern web technologies.
