'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { HiChevronRight, HiBookOpen, HiArrowLeft } from 'react-icons/hi2';
import { safeFetch } from '@/lib/api';

interface Category {
  _id: string;
  name: string;
  url: string;
  navigationHeadingId?: string;
  productCount?: number;
}

interface NavigationHeading {
  _id: string;
  name: string;
}

export default function CategoriesPage() {
  const searchParams = useSearchParams();
  const headingId = searchParams.get('headingId');

  const [categories, setCategories] = useState<Category[]>([]);
  const [navigationHeading, setNavigationHeading] = useState<NavigationHeading | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (headingId) {
      fetchCategories();
      fetchNavigationHeading();
    } else {
      fetchAllCategories();
    }
  }, [headingId]);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const result = await safeFetch<Category[]>(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/categories/navigation/${headingId}`
      );

      if ('data' in result) {
        setCategories(result.data);
      } else {
        setError(result.error || 'Failed to fetch categories');
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setError('Failed to fetch categories');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllCategories = async () => {
    try {
      setIsLoading(true);
      const result = await safeFetch<Category[]>(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/categories`
      );

      if ('data' in result) {
        setCategories(result.data);
      } else {
        setError(result.error || 'Failed to fetch categories');
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setError('Failed to fetch categories');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNavigationHeading = async () => {
    if (!headingId) return;

    try {
      const result = await safeFetch<NavigationHeading>(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/navigation/${headingId}`
      );

      if ('data' in result) {
        setNavigationHeading(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch navigation heading:', error);
    }
  };

  const handleCategoryClick = (category: Category) => {
    // Store navigation history in localStorage
    const history = JSON.parse(localStorage.getItem('navigationHistory') || '[]');
    const navigationItem = {
      id: category._id,
      name: category.name,
      type: 'category',
      headingId: headingId,
      timestamp: new Date().toISOString(),
    };

    // Add to history, keeping only last 10 items
    history.unshift(navigationItem);
    localStorage.setItem('navigationHistory', JSON.stringify(history.slice(0, 10)));
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          {navigationHeading && (
            <div className="flex items-center mb-4">
              <Link
                href="/"
                className="inline-flex items-center text-gray-500 hover:text-gray-700"
              >
                <HiArrowLeft className="h-4 w-4 mr-1" />
                Back to Home
              </Link>
            </div>
          )}
          <h1 className="text-3xl font-bold text-gray-900">
            {navigationHeading ? `${navigationHeading.name} Categories` : 'All Categories'}
          </h1>
          <p className="mt-2 text-gray-600">
            {navigationHeading
              ? `Explore categories within ${navigationHeading.name}`
              : 'Browse all available product categories'
            }
          </p>
        </div>

        {/* Categories Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                <div className="flex items-center mb-4">
                  <div className="h-8 w-8 bg-gray-200 rounded mr-4"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12">
            <HiBookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No categories found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {headingId
                ? 'No categories found for this navigation heading.'
                : 'No categories are currently available.'
              }
            </p>
            <div className="mt-6">
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Go Home
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category._id}
                href={`/products?categoryId=${category._id}`}
                onClick={() => handleCategoryClick(category)}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200 group"
              >
                <div className="flex items-center mb-4">
                  <HiBookOpen className="h-8 w-8 text-blue-600 mr-4 group-hover:text-blue-700" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900 truncate group-hover:text-blue-600">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {category.productCount ? `${category.productCount} products` : 'Browse products'}
                    </p>
                  </div>
                      <HiChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600" />
                </div>
                <div className="text-sm text-blue-600 group-hover:text-blue-700 font-medium">
                  View Products →
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Load More / Pagination could be added here */}
        {categories.length > 0 && !isLoading && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Showing {categories.length} categories
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
