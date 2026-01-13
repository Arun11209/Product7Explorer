'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  HiChevronLeft,
  HiChevronRight,
  HiMagnifyingGlass,
  HiAdjustmentsHorizontal,
  HiStar,
  HiArrowLeft
} from 'react-icons/hi2';
import { safeFetch } from '@/lib/api';

interface Product {
  _id: string;
  title: string;
  author?: string;
  price?: string;
  originalPrice?: string;
  imageUrl?: string;
  productUrl: string;
  sourceId: string;
  rating?: number;
  reviewCount?: number;
  isAvailable: boolean;
  lastScrapedAt?: string;
}

interface Category {
  _id: string;
  name: string;
}

interface PaginatedResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryId = searchParams.get('categoryId');
  const searchQuery = searchParams.get('q');

  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [searchTerm, setSearchTerm] = useState(searchQuery || '');
  const [sortBy, setSortBy] = useState('title');
  const [showFilters, setShowFilters] = useState(false);

  const productsPerPage = 24;

  useEffect(() => {
    fetchProducts();
    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId, currentPage, sortBy]);

  useEffect(() => {
    if (searchQuery) {
      setSearchTerm(searchQuery);
      handleSearch(searchQuery);
    }
  }, [searchQuery]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      let url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/products?page=${currentPage}&limit=${productsPerPage}&sort=${sortBy}`;

      if (categoryId) {
        url += `&categoryId=${categoryId}`;
      }

      const result = await safeFetch<PaginatedResponse>(url);

      if ('data' in result) {
        setProducts(result.data.products || []);
        setTotalPages(result.data.totalPages || 0);
        setTotalProducts(result.data.total || 0);
      } else {
        setError(result.error || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setError('Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategory = async () => {
    if (!categoryId) return;

    try {
      const result = await safeFetch<Category>(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/categories/${categoryId}`
      );

      if ('data' in result) {
        setCategory(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch category:', error);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      fetchProducts();
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/products/search?q=${encodeURIComponent(query)}&page=${currentPage}&limit=${productsPerPage}`;

      const result = await safeFetch<PaginatedResponse>(url);

      if ('data' in result) {
        setProducts(result.data.products || []);
        setTotalPages(result.data.totalPages || 0);
        setTotalProducts(result.data.total || 0);
      } else {
        setError(result.error || 'Search failed');
      }
    } catch (error) {
      console.error('Search failed:', error);
      setError('Search failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push('/products');
    }
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  const handleProductClick = (product: Product) => {
    // Store navigation history in localStorage
    const history = JSON.parse(localStorage.getItem('navigationHistory') || '[]');
    const navigationItem = {
      id: product._id,
      name: product.title,
      type: 'product',
      categoryId: categoryId,
      timestamp: new Date().toISOString(),
    };

    // Add to history, keeping only last 10 items
    history.unshift(navigationItem);
    localStorage.setItem('navigationHistory', JSON.stringify(history.slice(0, 10)));
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;

    const stars = [];
    const fullStars = Math.floor(rating);

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <HiStar key={i} className="h-4 w-4 text-yellow-400" />
      );
    }

    const emptyStars = 5 - fullStars;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <HiStar key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
      );
    }

    return stars;
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
          {category && (
            <div className="flex items-center mb-4">
              <Link
                href="/categories"
                className="inline-flex items-center text-gray-500 hover:text-gray-700"
              >
                <HiArrowLeft className="h-4 w-4 mr-1" />
                Back to Categories
              </Link>
            </div>
          )}
          <h1 className="text-3xl font-bold text-gray-900">
            {category ? category.name : searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
          </h1>
          <p className="mt-2 text-gray-600">
            {category
              ? `Explore products in ${category.name}`
              : searchQuery
                ? `Found ${totalProducts} products matching your search`
                : 'Browse our complete collection of products'
            }
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <form onSubmit={handleSearchSubmit} className="flex-1">
              <div className="relative">
                <HiMagnifyingGlass className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </form>

            {/* Sort */}
            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="title">Sort by Title</option>
                <option value="rating">Sort by Rating</option>
                <option value="-lastScrapedAt">Sort by Newest</option>
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <HiAdjustmentsHorizontal className="h-4 w-4 mr-2" />
                Filters
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery
                ? 'Try adjusting your search terms or browse all products.'
                : 'No products are currently available in this category.'
              }
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/products"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Browse All Products
              </Link>
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Go Home
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <Link
                  key={product._id}
                  href={`/products/${product._id}`}
                  onClick={() => handleProductClick(product)}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 group"
                >
                  <div className="aspect-w-3 aspect-h-4 bg-gray-200 relative overflow-hidden">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-100">
                        <span className="text-gray-400 text-sm">No image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600">
                      {product.title}
                    </h3>
                    {product.author && (
                      <p className="text-sm text-gray-500 mb-2">by {product.author}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {product.rating && (
                          <div className="flex items-center mr-2">
                            {renderStars(product.rating)}
                            <span className="text-sm text-gray-500 ml-1">
                              ({product.reviewCount || 0})
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {product.price || 'Price unavailable'}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{(currentPage - 1) * productsPerPage + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(currentPage * productsPerPage, totalProducts)}
                      </span>{' '}
                      of <span className="font-medium">{totalProducts}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <HiChevronLeft className="h-5 w-5" />
                      </button>
                      {[...Array(Math.min(5, totalPages))].map((_, i) => {
                        const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              pageNum === currentPage
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <HiChevronRight className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="flex space-x-4">
                <div className="h-10 bg-gray-200 rounded w-24"></div>
                <div className="h-10 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>

          {/* Products Grid Skeleton */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(24)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                <div className="aspect-w-3 aspect-h-4 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3 mb-3"></div>
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
