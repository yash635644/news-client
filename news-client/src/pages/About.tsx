import React from 'react';

const About = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 md:p-12 border border-gray-100 dark:border-gray-700">
                <h1 className="text-3xl font-black font-serif text-gray-900 dark:text-white mb-8">About Gathered</h1>

                <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                    <p className="mb-4 text-lg">
                        Gathered is an innovative news curation and analysis platform designed to cut through the noise of the modern 24/7 news cycle.
                    </p>

                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Our Mission</h2>
                    <p className="mb-4">
                        We believe that staying informed shouldn't be overwhelming. By leveraging advanced artificial intelligence alongside human editorial oversight, Gathered synthesizes global events from thousands of sources to provide you with clear, concise, and objective analysis.
                    </p>

                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">How It Works</h2>
                    <p className="mb-4">
                        Our platform continuously monitors reputable global news sources. When major events happen, our AI models analyze the reporting across multiple outlets, extracting key facts and filtering out sensationalism. The result is a comprehensive, easy-to-read summary that provides essential context without the bias.
                    </p>

                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Editorial Philosophy</h2>
                    <p className="mb-4">
                        While technology powers our curation, journalistic integrity remains our core focus. We ensure all AI-generated analyses link directly back to their primary sources, transparently attributing information and respecting the vital work of original publishers globally.
                    </p>

                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">The Team</h2>
                    <p className="mb-4">
                        Gathered is maintained by a dedicated team of technologists and editors passionate about improving the global information diet. We are constantly refining our models to ensure accuracy, neutrality, and readability.
                    </p>

                    <p className="mt-8 text-sm italic border-t border-gray-100 dark:border-gray-700 pt-6">
                        For journalistic inquiries or feedback, please reach out via our homepage contact form.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About;
