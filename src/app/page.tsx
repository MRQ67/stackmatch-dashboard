'use client'

import Link from 'next/link';
import { Code, GitBranch, Shield, BarChart, Zap, Users, Terminal } from 'lucide-react';
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

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
        <motion.div 
          className="text-center py-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Streamline Your Development Workflow
          </motion.h1>
          <motion.p 
            className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            StackMatch helps developers manage, compare, and optimize their development environments with powerful tools and integrations.
          </motion.p>
          <motion.div 
            className="mt-10 flex items-center justify-center gap-x-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size="lg" className="text-base" asChild>
                <Link href="/auth?signup=true">
                  Get Started for Free
                  <Zap className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size="lg" variant="outline" className="text-base" asChild>
                <Link href="/about-us">
                  Learn More
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.div 
          className="py-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Powerful Features for Developers
            </h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
              Everything you need to manage your development environments efficiently
            </p>
          </motion.div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                className="p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
              >
                <motion.div 
                  className="text-indigo-600 dark:text-primary"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                  viewport={{ once: true }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-4">
                  {feature.title}
                </h3>
                <p className="mt-2 text-gray-600 dark:text-white">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          className="bg-zinc-800 rounded-2xl p-8 md:p-12 my-16 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-3xl font-bold text-white sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Ready to optimize your workflow?
          </motion.h2>
          <motion.p 
            className="mt-4 text-xl text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Join thousands of developers who have streamlined their development process with StackMatch.
          </motion.p>
          <motion.div 
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size="lg" className="bg-primary text-black hover:bg-primary/90 text-base" asChild>
                <Link href="/auth?signup=true">
                  Start Your Free Trial
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

    </DashboardLayout>
  );
}