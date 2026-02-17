import React from 'react';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 md:p-12 border border-gray-100 dark:border-gray-700">
        <h1 className="text-3xl font-black font-serif text-gray-900 dark:text-white mb-8">Terms of Service</h1>
        
        <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
          <p className="mb-4">Last Updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing and using Gathered, you accept and agree to be bound by the terms and provision of this agreement.
          </p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">2. Service Description</h2>
          <p className="mb-4">
            Gathered is an automated news aggregator. We do not create original news content but aggregate headlines and summaries from publicly available RSS feeds.
          </p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">3. Intellectual Property</h2>
          <p className="mb-4">
            All news headlines, summaries, and images displayed are the property of their respective publishers. We claim no ownership over the original articles. 
            Links are provided to the original source for full reading.
          </p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">4. User Conduct</h2>
          <p className="mb-4">
            You agree not to use the website for any unlawful purpose or to conduct any activity that would constitute a civil or criminal offense.
          </p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">5. Disclaimer of Warranties</h2>
          <p className="mb-4">
            The service is provided on an "as is" basis. We do not guarantee the accuracy, completeness, or timeliness of the news content aggregated.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;