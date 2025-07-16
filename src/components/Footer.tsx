
'use client';

import Link from 'next/link';
import { VelocityScroll } from "@/components/magicui/scroll-based-velocity";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-black border-t border-gray-200 dark:border-black" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      <div className="w-full mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <div className="flex items-center">
              <img src="/footer.svg" alt="StackMatch by" className="h-14 w-auto" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-base">
              Empowering developers with better environment management tools.
            </p>
          </div>
          <div className="mt-12 xl:mt-0 xl:col-span-2 flex justify-end">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase">
                Navigation
              </h3>
              <ul role="list" className="mt-4 space-y-4">
                <li><Link href="/" className="text-base text-gray-500 hover:text-gray-900 dark:hover:text-white">Home</Link></li>
                <li><Link href="/cli" className="text-base text-gray-500 hover:text-gray-900 dark:hover:text-white">CLI</Link></li>
                <li><Link href="/about-us" className="text-base text-gray-500 hover:text-gray-900 dark:hover:text-white">About</Link></li>
              </ul>
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
