'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { safeFetch } from '@/lib/api';
// Using inline SVG icons for better reliability

interface NavigationHeading {
  _id: string;
  name: string;
  url: string;
}

export default function Navigation() {
  const [navigationHeadings, setNavigationHeadings] = useState<NavigationHeading[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchNavigationHeadings();
  }, []);

  const fetchNavigationHeadings = async () => {
    try {
      const result = await safeFetch<NavigationHeading[]>(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/navigation`
      );
      if ('data' in result) {
        setNavigationHeadings(result.data);
      } else {
        console.error('Failed to fetch navigation headings:', result.error);
      }
    } catch (error) {
      console.error('Failed to fetch navigation headings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigationClick = (heading: NavigationHeading) => {
    // Store navigation history in localStorage
    const history = JSON.parse(localStorage.getItem('navigationHistory') || '[]');
    const navigationItem = {
      id: heading._id,
      name: heading.name,
      type: 'heading',
      timestamp: new Date().toISOString(),
    };

    // Add to history, keeping only last 10 items
    history.unshift(navigationItem);
    localStorage.setItem('navigationHistory', JSON.stringify(history.slice(0, 10)));

    router.push(`/categories?headingId=${heading._id}`);
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900">
                Product Explorer
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Home
              </Link>
              {isLoading ? (
                <div className="flex space-x-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-4 w-20 bg-gray-200 rounded animate-pulse mt-3"></div>
                  ))}
                </div>
              ) : (
                navigationHeadings.slice(0, 5).map((heading) => (
                  <button
                    key={heading._id}
                    onClick={() => handleNavigationClick(heading)}
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    {heading.name}
                  </button>
                ))
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Link
              href="/about"
              className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500"
            >
              About
            </Link>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            {navigationHeadings.map((heading) => (
              <button
                key={heading._id}
                onClick={() => handleNavigationClick(heading)}
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 w-full text-left"
              >
                {heading.name}
              </button>
            ))}
            <Link
              href="/about"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
