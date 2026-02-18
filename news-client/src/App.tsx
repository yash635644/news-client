/**
 * App.tsx
 * Main entry point for the News Aggregator Client Application.
 * Handles routing, global layout (Navbar, Footer, Ticker), and toast notifications.
 */
import { HelmetProvider } from 'react-helmet-async';

// ... other imports ...
import ArticlePage from './pages/ArticlePage';

const App = () => {
  return (
    <HelmetProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Toaster position="top-center" reverseOrder={false} />
          <Ticker />
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/news/:id" element={<ArticlePage />} />
              <Route path="/subscribe" element={<Subscribe />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
            </Routes>
          </main>

          {/* Footer content... */}
          <footer className="bg-gray-900 text-white border-t border-gray-800 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

              {/* Brand & Description */}
              <div className="col-span-1 md:col-span-1">
                <h3 className="text-2xl font-black font-serif mb-4">GATH<span className="text-brand-500">ERED</span></h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  The world's first fully AI-powered autonomous news aggregator, delivering unbiased, real-time updates from over 5,000 global sources.
                </p>
              </div>

              {/* Categories Links */}
              <div>
                <h4 className="font-bold uppercase tracking-wider mb-4 text-gray-500 text-xs">Categories</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li><Link to="/?category=India" className="hover:text-white transition-colors">India</Link></li>
                  <li><Link to="/?category=World" className="hover:text-white transition-colors">World</Link></li>
                  <li><Link to="/?category=Tech" className="hover:text-white transition-colors">Technology</Link></li>
                  <li><Link to="/?category=Business" className="hover:text-white transition-colors">Business</Link></li>
                  <li><Link to="/?category=Education" className="hover:text-white transition-colors">Education</Link></li>
                  <li><Link to="/?category=Environment" className="hover:text-white transition-colors">Environment</Link></li>
                </ul>
              </div>

              {/* Legal Links */}
              <div>
                <h4 className="font-bold uppercase tracking-wider mb-4 text-gray-500 text-xs">Legal</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                  <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                  <li><Link to="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link></li>
                </ul>
              </div>

              {/* Social Connect */}
              <div>
                <h4 className="font-bold uppercase tracking-wider mb-4 text-gray-500 text-xs">Connect</h4>
                <div className="flex space-x-4">
                  <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-brand-600 transition-colors cursor-pointer">X</div>
                  <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-brand-600 transition-colors cursor-pointer">In</div>
                  <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-brand-600 transition-colors cursor-pointer">Fb</div>
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
              <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-center md:text-left">
                <p>&copy; {new Date().getFullYear()} Gathered Inc. All rights reserved.</p>
                <span className="hidden md:inline text-gray-700">|</span>
                <a
                  href="https://yash635644.github.io/yash-portfolio/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-brand-400 transition-colors font-medium"
                >
                  Designed & Developed by Yash Trivedi
                </a>
              </div>
              <div className="flex gap-4 mt-4 md:mt-0">
                {/* Admin login removed for client app */}
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </HelmetProvider>
  );
};

export default App;
