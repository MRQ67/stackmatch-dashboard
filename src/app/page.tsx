'use client'

import Link from 'next/link';
import { Code, GitBranch, Shield, BarChart, Zap, Users, Terminal } from 'lucide-react';
import DashboardLayout from "@/components/DashboardLayout";
import Footer from "@/components/Footer";
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const features = [
    {
      icon: <Code className="w-8 h-8 mb-4" />,
      title: "Environment Management",
      description: "Easily create, manage, and organize your development environments in one place."
    },
    {
      icon: <GitBranch className="w-8 h-8 mb-4" />,
      title: "Version Control",
      description: "Track changes and maintain different versions of your environment configurations."
    },
    {
      icon: <Shield className="w-8 h-8 mb-4" />,
      title: "Security First",
      description: "Enterprise-grade security to keep your environments and data protected."
    },
    {
      icon: <BarChart className="w-8 h-8 mb-4" />,
      title: "Analytics",
      description: "Gain insights into your environment usage and performance metrics."
    },
    {
      icon: <Users className="w-8 h-8 mb-4" />,
      title: "Team Collaboration",
      description: "Share environments with your team and collaborate in real-time."
    },
    {
      icon: <Terminal className="w-8 h-8 mb-4" />,
      title: "CLI Integration",
      description: "Manage your environments directly from your terminal with our powerful CLI tool."
    }
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Hero Section */}
        <div className="text-center py-20">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            Streamline Your Development Workflow
          </h1>
          <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            StackMatch helps developers manage, compare, and optimize their development environments with powerful tools and integrations.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/auth?signup=true" legacyBehavior>
              <Button size="lg" className="text-base">
                Get Started for Free
                <Zap className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/about-us" legacyBehavior>
              <Button size="lg" variant="outline" className="text-base">
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Powerful Features for Developers
            </h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
              Everything you need to manage your development environments efficiently
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className="p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="text-indigo-600 dark:text-primary">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-4">
                  {feature.title}
                </h3>
                <p className="mt-2 text-gray-600 dark:text-white">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-zinc-800 rounded-2xl p-8 md:p-12 my-16 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to optimize your workflow?
          </h2>
          <p className="mt-4 text-xl text-white">
            Join thousands of developers who have streamlined their development process with StackMatch.
          </p>
          <div className="mt-8">
            <Link href="/auth?signup=true" legacyBehavior>
              <Button size="lg" className="bg-primary text-black hover:bg-primary/90 text-base">
                Start Your Free Trial
              </Button>
            </Link>
          </div> 
        </div>
      </div>
      <Footer />
    </DashboardLayout>
  );
}