'use client';

import { Users, Code, GitBranch, Shield } from 'lucide-react';
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const team = [
  {
    name: 'Abdellah Qadi',
    role: 'Founder',
    bio: '',
    image: '/team/alex.jpg'
  },
];

const values = [
  {
    name: 'Developer First',
    description: 'We build tools that developers love to use, with a focus on developer experience and productivity.',
    icon: <Code className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
  },
  {
    name: 'Open By Default',
    description: 'We believe in transparency and contribute to open source to give back to the community.',
    icon: <GitBranch className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
  },
  {
    name: 'Security Focused',
    description: 'We prioritize the security and privacy of your development environments and data.',
    icon: <Shield className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
  }
];

export default function AboutUsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl md:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Building the Future of Development
          </motion.h1>
          <motion.p 
            className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            At StackMatch, we&apos;re on a mission to revolutionize how developers manage and optimize their development environments.
          </motion.p>
        </motion.div>

        {/* Our Story */}
        <motion.div 
          className="py-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="max-w-3xl mx-auto">
            <motion.h2 
              className="text-3xl font-bold text-gray-900 dark:text-white mb-6"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Our Story
            </motion.h2>
            <div className="space-y-6 text-gray-600 dark:text-gray-300">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Founded in 2024, StackMatch was born out of frustration with the complexity of managing development environments across teams.
                Our team of experienced developers and designers came together to create a solution that would make environment management
                seamless, secure, and collaborative.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                What started as a simple tool to help our own team has grown into a platform used by thousands of developers worldwide.
                We&apos;re proud to be building tools that help developers focus on what they do best: creating amazing software.
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* Our Values */}
        <motion.div 
          className="py-12 bg-gray-50 dark:bg-gray-800 rounded-2xl px-6 my-12"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="max-w-7xl mx-auto">
            <motion.h2 
              className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Our Values
            </motion.h2>
            <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
              {values.map((value, index) => (
                <motion.div 
                  key={index} 
                  className="text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div 
                    className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-900 mx-auto mb-4"
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 + 0.3 }}
                    viewport={{ once: true }}
                  >
                    {value.icon}
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{value.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div 
          className="py-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Meet Our Team
          </motion.h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-1 lg:grid-cols-1">
            {team.map((member, index) => (
              <motion.div 
                key={index} 
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <Users className="h-16 w-16 text-gray-400" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                  <p className="text-indigo-600 dark:text-indigo-400 mb-3">{member.role}</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          className="bg-indigo-700 rounded-2xl p-8 md:p-12 my-16 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-3xl font-bold text-white sm:text-4xl mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Join Our Growing Community
          </motion.h2>
          <motion.p 
            className="mt-2 text-xl text-indigo-100 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            We&apos;re always looking for passionate individuals to join our team or contribute to our open-source projects.
          </motion.p>
          <motion.div 
            className="mt-8 flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size="lg" className="bg-white text-indigo-700 hover:bg-indigo-50">
                View Open Positions
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-indigo-600">
                Contribute on GitHub
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
