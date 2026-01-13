'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { HiChevronRight, HiMagnifyingGlass, HiBookOpen } from 'react-icons/hi2';
import { safeFetch } from '@/lib/api';

interface NavigationHeading {
  _id: string;
  name: string;
  url: string;
}

export default function Home() {
  const [navigationHeadings, setNavigationHeadings] = useState<NavigationHeading[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ products: 0, categories: 0, reviews: 0 });

  useEffect(() => {
    fetchNavigationHeadings();
    fetchStats();
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

  const fetchStats = async () => {
    try {
      // Fetch basic stats - you might want to add dedicated endpoints for these
      const [productsResult, categoriesResult] = await Promise.all([
        safeFetch<{ total: number }>(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/products?page=1&limit=1`),
        safeFetch<{ total: number }>(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/categories?page=1&limit=1`),
      ]);

      if ('data' in productsResult) {
        setStats(prev => ({ ...prev, products: productsResult.data.total || 0 }));
      }

      if ('data' in categoriesResult) {
        setStats(prev => ({ ...prev, categories: categoriesResult.data.total || 0 }));
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              Discover Amazing Products
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Explore our curated collection of products from World of Books. Find detailed information,
              read reviews, and discover recommendations powered by live data scraping.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link
                  href="/products"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                >
                  Browse Products
                  <HiChevronRight className="ml-2 -mr-1 w-4 h-4" />
                </Link>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <Link
                  href="/search"
                  className="w-full flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                >
                  <HiMagnifyingGlass className="mr-2 -ml-1 w-4 h-4" />
                  Search
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{stats.products.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Products Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{stats.categories.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{stats.reviews.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Reviews</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Categories Section */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Browse by Category
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Explore products organized by categories from World of Books
            </p>
          </div>

          <div className="mt-12">
            {isLoading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {navigationHeadings.map((heading) => (
                  <Link
                    key={heading._id}
                    href={`/categories?headingId=${heading._id}`}
                    className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-center">
                      <HiBookOpen className="h-8 w-8 text-blue-600 mr-4" />
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{heading.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Explore products in this category
                        </p>
                      </div>
                      <HiChevronRight className="h-5 w-5 text-gray-400 ml-auto" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Why Choose Our Platform?
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-md bg-blue-500 text-white">
                <HiBookOpen className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Live Data</h3>
              <p className="mt-2 text-base text-gray-500">
                Always up-to-date product information scraped directly from World of Books
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-md bg-green-500 text-white">
                <HiMagnifyingGlass className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Detailed Search</h3>
              <p className="mt-2 text-base text-gray-500">
                Advanced search and filtering to find exactly what you're looking for
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-md bg-purple-500 text-white">
                <HiChevronRight className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">User Reviews</h3>
              <p className="mt-2 text-base text-gray-500">
                Read authentic reviews and ratings from real customers
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
