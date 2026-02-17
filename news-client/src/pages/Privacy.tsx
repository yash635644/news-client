import React from 'react';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 md:p-12 border border-gray-100 dark:border-gray-700">
        <h1 className="text-3xl font-black font-serif text-gray-900 dark:text-white mb-8">Privacy Policy</h1>
        
        <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
          <p className="mb-4">Last Updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">1. Introduction</h2>
          <p className="mb-4">
            Welcome to Gathered ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. 
            This Privacy Policy explains how we collect, use, and share your information when you visit our website.
          </p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">2. Information We Collect</h2>
          <p className="mb-4">
            We collect minimal information to provide our news aggregation service:
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li><strong>Usage Data:</strong> Information about how you use our website, such as pages visited and time spent.</li>
            <li><strong>Device Data:</strong> Basic technical data like browser type and screen size for responsive design.</li>
            <li><strong>Subscription Data:</strong> If you subscribe to our newsletter, we collect your email address and name.</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">3. How We Use Your Information</h2>
          <p className="mb-4">
            We use your information solely to:
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>Provide and improve our news aggregation algorithms.</li>
            <li>Deliver newsletters you have opted into.</li>
            <li>Analyze traffic to optimize website performance.</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">4. Third-Party Links</h2>
          <p className="mb-4">
            Our service aggregates content from external news sources (RSS feeds). Clicking on news articles will take you to third-party websites. 
            We are not responsible for the privacy practices of these external sites.
          </p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">5. Contact Us</h2>
          <p className="mb-4">
            If you have questions about this policy, please contact us at privacy@gathered.com.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;