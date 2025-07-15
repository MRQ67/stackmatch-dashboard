'use client';

import { Users, Code, GitBranch, Shield } from 'lucide-react';
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from '@/components/ui/button';

const team = [
  {
    name: 'Alex Johnson',
    role: 'Founder & CEO',
    bio: '10+ years of experience in developer tools and infrastructure. Previously led engineering teams at TechCorp.',
    image: '/team/alex.jpg'
  },
  {
    name: 'Samantha Lee',
    role: 'CTO',
    bio: 'Expert in cloud infrastructure and distributed systems. Built developer platforms used by thousands of teams.',
    image: '/team/sam.jpg'
  },
  {
    name: 'Michael Chen',
    role: 'Lead Developer',
    bio: 'Full-stack engineer passionate about creating intuitive developer experiences and scalable architectures.',
    image: '/team/michael.jpg'
  },
  {
    name: 'Emma Wilson',
    role: 'Product Designer',
    bio: 'Design leader focused on creating seamless user experiences for complex technical products.',
    image: '/team/emma.jpg'
  }
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
        <div className="text-center mb-20">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            Building the Future of Development
          </h1>
          <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            At StackMatch, we&apos;re on a mission to revolutionize how developers manage and optimize their development environments.
          </p>
        </div>

        {/* Our Story */}
        <div className="py-12">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Story</h2>
            <div className="space-y-6 text-gray-600 dark:text-gray-300">
              <p>
                Founded in 2023, StackMatch was born out of frustration with the complexity of managing development environments across teams. 
                Our team of experienced developers and designers came together to create a solution that would make environment management 
                seamless, secure, and collaborative.
              </p>
              <p>
                What started as a simple tool to help our own team has grown into a platform used by thousands of developers worldwide. 
                We&apos;re proud to be building tools that help developers focus on what they do best: creating amazing software.
              </p>
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="py-12 bg-gray-50 dark:bg-gray-800 rounded-2xl px-6 my-12">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Our Values</h2>
            <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
              {values.map((value, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-900 mx-auto mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{value.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="py-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <div className="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <Users className="h-16 w-16 text-gray-400" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                  <p className="text-indigo-600 dark:text-indigo-400 mb-3">{member.role}</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-indigo-700 rounded-2xl p-8 md:p-12 my-16 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl mb-4">
            Join Our Growing Community
          </h2>
          <p className="mt-2 text-xl text-indigo-100 max-w-2xl mx-auto">
            We're always looking for passionate individuals to join our team or contribute to our open-source projects.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-white text-indigo-700 hover:bg-indigo-50">
              View Open Positions
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-indigo-600">
              Contribute on GitHub
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
