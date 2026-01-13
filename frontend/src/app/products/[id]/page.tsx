'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  HiStar,
  HiArrowLeft,
  HiArrowPath,
  HiArrowTopRightOnSquare,
  HiBookOpen,
  HiCalendar,
  HiTag,
  HiUser
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
  description?: string;
  publisher?: string;
  publicationDate?: string;
  isbn?: string;
  rating?: number;
  reviewCount?: number;
  tags?: string[];
  isAvailable: boolean;
  isScraped: boolean;
  lastScrapedAt?: string;
}

interface Review {
  _id: string;
  reviewerName?: string;
  rating?: number;
  title?: string;
  content: string;
  reviewDate?: string;
  isVerified: boolean;
}

interface RelatedProduct {
  _id: string;
  title: string;
  author?: string;
  price?: string;
  imageUrl?: string;
  rating?: number;
  reviewCount?: number;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    reviewerName: '',
    rating: 5,
    title: '',
    content: '',
  });

  useEffect(() => {
    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [productResult, reviewsResult, relatedResult] = await Promise.all([
        safeFetch<Product>(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/products/${productId}`),
        safeFetch<Review[]>(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/products/${productId}/reviews`),
        safeFetch<RelatedProduct[]>(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/products/${productId}/related?limit=6`),
      ]);

      if ('data' in productResult) {
        setProduct(productResult.data);
      } else {
        setError(productResult.error || 'Product not found');
        return;
      }

      if ('data' in reviewsResult) {
        setReviews(reviewsResult.data);
      }

      if ('data' in relatedResult) {
        setRelatedProducts(relatedResult.data);
      }
    } catch (error) {
      console.error('Failed to fetch product details:', error);
      setError('Failed to load product details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshData = async () => {
    try {
      setIsRefreshing(true);

      // Trigger scraping for this product
      const result = await safeFetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/scraping/products/${productId}/details`,
        { method: 'POST' }
      );

      if ('data' in result) {
        // Wait a bit then refresh the data
        setTimeout(() => {
          fetchProductDetails();
        }, 2000);
      } else {
        console.error('Failed to trigger scraping:', result.error);
      }
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reviewForm.content.trim()) {
      alert('Please write a review');
      return;
    }

    try {
      setIsSubmittingReview(true);

      const result = await safeFetch<Review>(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/products/${productId}/reviews`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reviewForm),
        }
      );

      if ('data' in result) {
        setReviews(prev => [result.data, ...prev]);
        setReviewForm({
          reviewerName: '',
          rating: 5,
          title: '',
          content: '',
        });
        setShowReviewForm(false);
      } else {
        alert('Failed to submit review: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Failed to submit review:', error);
      alert('Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleReviewFormChange = (field: string, value: string | number) => {
    setReviewForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;

    const stars = [];
    const fullStars = Math.floor(rating);

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <HiStar key={i} className="h-5 w-5 text-yellow-400" />
      );
    }

    const emptyStars = 5 - fullStars;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <HiStar key={`empty-${i}`} className="h-5 w-5 text-gray-300" />
      );
    }

    return stars;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
            <Link
              href="/products"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <HiArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Link>
        </div>
      </div>
    );
  }

  if (isLoading || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-sm p-8">
                <div className="h-64 bg-gray-200 rounded mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                Home
              </Link>
            </li>
            <li>
              <span className="text-gray-400">/</span>
            </li>
            <li>
              <Link href="/products" className="text-gray-500 hover:text-gray-700">
                Products
              </Link>
            </li>
            <li>
              <span className="text-gray-400">/</span>
            </li>
            <li>
              <span className="text-gray-900 font-medium truncate max-w-xs">
                {product.title}
              </span>
            </li>
          </ol>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="aspect-w-3 aspect-h-4 bg-gray-100 rounded-lg overflow-hidden mb-4">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.title}
                  width={400}
                  height={600}
                  className="w-full h-full object-cover"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                      <HiBookOpen className="h-24 w-24 text-gray-400" />
                </div>
              )}
            </div>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {renderStars(product.rating)}
                </div>
                <span className="ml-2 text-lg font-medium text-gray-900">
                  {product.rating.toFixed(1)}
                </span>
                <span className="ml-2 text-sm text-gray-500">
                  ({product.reviewCount || 0} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="mb-4">
              <span className="text-2xl font-bold text-gray-900">
                {product.price || 'Price not available'}
              </span>
              {product.originalPrice && product.originalPrice !== product.price && (
                <span className="ml-2 text-lg text-gray-500 line-through">
                  {product.originalPrice}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <a
                href={product.productUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <HiArrowTopRightOnSquare className="h-4 w-4 mr-2" />
                View on World of Books
              </a>
              <button
                onClick={handleRefreshData}
                disabled={isRefreshing}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                <HiArrowPath className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
              </button>
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              {product.author && (
                <p className="text-xl text-gray-600 mb-4">by {product.author}</p>
              )}

              {/* Product Metadata */}
              <div className="grid grid-cols-1 gap-4 text-sm">
                {product.publisher && (
                  <div className="flex items-center">
                    <HiTag className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">Publisher:</span>
                    <span className="ml-2 font-medium">{product.publisher}</span>
                  </div>
                )}
                {product.publicationDate && (
                  <div className="flex items-center">
                    <HiCalendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">Publication Date:</span>
                    <span className="ml-2 font-medium">{product.publicationDate}</span>
                  </div>
                )}
                {product.isbn && (
                  <div className="flex items-center">
                    <HiBookOpen className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">ISBN:</span>
                    <span className="ml-2 font-medium">{product.isbn}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="ml-2 font-medium">{formatDate(product.lastScrapedAt)}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Customer Reviews ({reviews.length})
            </h2>

            <div className="space-y-6">
              {displayedReviews.map((review) => (
                <div key={review._id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <HiUser className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="font-medium text-gray-900">
                        {review.reviewerName || 'Anonymous'}
                      </span>
                      {review.isVerified && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    {review.rating && (
                      <div className="flex items-center">
                        {renderStars(review.rating)}
                        <span className="ml-2 text-sm font-medium">{review.rating}</span>
                      </div>
                    )}
                  </div>

                  {review.title && (
                    <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
                  )}

                  <p className="text-gray-700 leading-relaxed">{review.content}</p>

                  {review.reviewDate && (
                    <p className="text-sm text-gray-500 mt-2">
                      Reviewed on {formatDate(review.reviewDate)}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Write Review Button */}
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Write a Review
              </button>
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <div className="mt-6 border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Write Your Review</h3>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="reviewerName" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name (Optional)
                    </label>
                    <input
                      type="text"
                      id="reviewerName"
                      value={reviewForm.reviewerName}
                      onChange={(e) => handleReviewFormChange('reviewerName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Anonymous"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating
                    </label>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleReviewFormChange('rating', star)}
                          className="focus:outline-none"
                        >
                          <HiStar
                            className={`h-6 w-6 ${
                              star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-2 text-sm text-gray-600">{reviewForm.rating} stars</span>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="reviewTitle" className="block text-sm font-medium text-gray-700 mb-1">
                      Review Title (Optional)
                    </label>
                    <input
                      type="text"
                      id="reviewTitle"
                      value={reviewForm.title}
                      onChange={(e) => handleReviewFormChange('title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Summarize your experience"
                    />
                  </div>

                  <div>
                    <label htmlFor="reviewContent" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Review *
                    </label>
                    <textarea
                      id="reviewContent"
                      rows={4}
                      value={reviewForm.content}
                      onChange={(e) => handleReviewFormChange('content', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Share your thoughts about this product..."
                      required
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {reviews.length > 3 && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  {showAllReviews ? 'Show Less Reviews' : `Show All ${reviews.length} Reviews`}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">You Might Also Like</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct._id}
                  href={`/products/${relatedProduct._id}`}
                  className="group"
                >
                  <div className="aspect-w-3 aspect-h-4 bg-gray-100 rounded-lg overflow-hidden mb-3">
                    {relatedProduct.imageUrl ? (
                      <Image
                        src={relatedProduct.imageUrl}
                        alt={relatedProduct.title}
                        width={300}
                        height={400}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <HiBookOpen className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <h3 className="font-medium text-gray-900 group-hover:text-blue-600 line-clamp-2 mb-1">
                    {relatedProduct.title}
                  </h3>

                  {relatedProduct.author && (
                    <p className="text-sm text-gray-500 mb-2">by {relatedProduct.author}</p>
                  )}

                  <div className="flex items-center justify-between">
                    {relatedProduct.rating && (
                      <div className="flex items-center">
                        {renderStars(relatedProduct.rating)}
                        <span className="text-sm text-gray-500 ml-1">
                          ({relatedProduct.reviewCount || 0})
                        </span>
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-900">
                      {relatedProduct.price || 'Price unavailable'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
