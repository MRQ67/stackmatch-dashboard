'use client';

import Link from 'next/link';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { VelocityScroll } from "@/components/magicui/scroll-based-velocity";

const navigation = {
  product: [
    { name: 'Features', href: '/#features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'CLI', href: '/cli' },
    { name: 'API', href: '/docs/api' },
  ],
  company: [
    { name: 'About', href: '/about-us' },
    { name: 'Blog', href: '/blog' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact', href: '/contact' },
  ],
  legal: [
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
    { name: 'Security', href: '/security' },
  ],
  social: [
    {
      name: 'GitHub',
      href: 'https://github.com/MRQ67/stackmatch-dashboard',
      icon: Github,
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com/stackmatch',
      icon: Twitter,
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/company/stackmatch',
      icon: Linkedin,
    },
    {
      name: 'Email',
      href: 'mailto:contact@stackmatch.dev',
      icon: Mail,
    },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-black border-t border-gray-200 dark:border-black" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <div className="flex items-center">
              <img src="/footer.svg" alt="StackMatch by" className="h-14 w-auto" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-base">
              Empowering developers with better environment management tools.
            </p>
            <div className="flex space-x-6
            ">
              {navigation.social.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-white"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase">
                  Product
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  {navigation.product.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-base text-gray-500 hover:text-gray-900 dark:hover:text-white"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase">
                  Company
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  {navigation.company.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-base text-gray-500 hover:text-gray-900 dark:hover:text-white"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase">
                  Legal
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  {navigation.legal.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-base text-gray-500 hover:text-gray-900 dark:hover:text-white"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase">
                  Resources
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <Link
                      href="/docs"
                      className="text-base text-gray-500 hover:text-gray-900 dark:hover:text-white"
                    >
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/changelog"
                      className="text-base text-gray-500 hover:text-gray-900 dark:hover:text-white"
                    >
                      Changelog
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/status"
                      className="text-base text-gray-500 hover:text-gray-900 dark:hover:text-white"
                    >
                      Status
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 overflow-hidden">
            <VelocityScroll 
              defaultVelocity={3} 
              numRows={2}
              className="text-6xl md:text-8xl font-bold text-white opacity-20"
            >
              Stackmatch by AA³
            </VelocityScroll>
          </div>
        <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-base text-gray-500 dark:text-gray-400 text-center md:text-left">
            &copy; {new Date().getFullYear()} StackMatch. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <Link
              href="https://github.com/MRQ67/stackmatch-dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white"
            >
              View on GitHub
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
