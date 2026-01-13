import Link from 'next/link';
import {
  HiBookOpen,
  HiCodeBracket,
  HiGlobeAlt,
  HiCpuChip,
  HiShieldCheck,
  HiChartBar
} from 'react-icons/hi2';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            About Product Data Explorer
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            A production-minded product exploration platform powered by live web scraping
          </p>
        </div>

        {/* Mission */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              To create a seamless product discovery experience by aggregating and presenting
              product information from World of Books in an intuitive, fast, and accessible way.
              We believe in the power of data to help users make informed decisions about their purchases.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Key Features</h2>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <HiGlobeAlt className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Live Data Scraping</h3>
              </div>
              <p className="text-gray-600">
                Real-time data extraction from World of Books using advanced web scraping
                technologies to ensure you always see the latest product information.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <HiBookOpen className="h-8 w-8 text-green-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Rich Product Details</h3>
              </div>
              <p className="text-gray-600">
                Comprehensive product information including descriptions, reviews, ratings,
                publication details, and recommendations for better decision making.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <HiChartBar className="h-8 w-8 text-purple-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Smart Categorization</h3>
              </div>
              <p className="text-gray-600">
                Intuitive navigation through hierarchical categories and subcategories,
                making it easy to discover products that match your interests.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <HiShieldCheck className="h-8 w-8 text-red-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Respectful Scraping</h3>
              </div>
              <p className="text-gray-600">
                Built with rate limiting, caching, and deduplication to minimize impact
                on source websites while ensuring data freshness and reliability.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <HiCodeBracket className="h-8 w-8 text-indigo-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Modern Tech Stack</h3>
              </div>
              <p className="text-gray-600">
                Built with Next.js, NestJS, MongoDB, and Crawlee for a robust,
                scalable, and maintainable product exploration platform.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <HiCpuChip className="h-8 w-8 text-orange-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Performance Focused</h3>
              </div>
              <p className="text-gray-600">
                Optimized for speed with client-side caching, lazy loading,
                and efficient data fetching strategies for the best user experience.
              </p>
            </div>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Technology Stack</h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Frontend</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Next.js 16 (App Router)</li>
                <li>• React 19</li>
                <li>• TypeScript</li>
                <li>• Tailwind CSS</li>
                <li>• SWR for data fetching</li>
                <li>• Heroicons</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Backend</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• NestJS (Node.js + TypeScript)</li>
                <li>• MongoDB with Mongoose</li>
                <li>• Redis for queuing</li>
                <li>• Bull for job processing</li>
                <li>• Rate limiting & throttling</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Scraping</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Crawlee framework</li>
                <li>• Playwright browser automation</li>
                <li>• Intelligent selectors</li>
                <li>• Data deduplication</li>
                <li>• Error handling & retries</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Deployment</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Vercel (Frontend)</li>
                <li>• Railway/Heroku (Backend)</li>
                <li>• MongoDB Atlas</li>
                <li>• Redis Cloud</li>
                <li>• Docker support</li>
              </ul>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">How It Works</h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-blue-100 mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Collection</h3>
              <p className="text-gray-600">
                Our scraping system visits World of Books to collect navigation headings,
                categories, and product information using headless browsers.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-green-100 mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Processing</h3>
              <p className="text-gray-600">
                Collected data is processed, deduplicated, and stored in our database
                with proper relationships and metadata.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-purple-100 mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">User Experience</h3>
              <p className="text-gray-600">
                Users browse through an intuitive interface with fast search,
                filtering, and detailed product pages with reviews and recommendations.
              </p>
            </div>
          </div>
        </div>

        {/* Contact & Links */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Get In Touch</h2>
            <p className="text-gray-600 mb-6">
              Have questions, suggestions, or want to contribute? We'd love to hear from you.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-md text-base font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <HiCodeBracket className="h-5 w-5 mr-2" />
                View on GitHub
              </a>
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 border border-transparent rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <HiBookOpen className="h-5 w-5 mr-2" />
                Start Exploring
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center text-gray-500">
          <p className="text-sm">
            This project is built for educational and demonstration purposes.
            All data is sourced from World of Books and presented in compliance with their terms of service.
          </p>
        </div>
      </div>
    </div>
  );
}
