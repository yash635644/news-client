import React, { useState } from 'react';
import { Mail, User, Phone, CheckCircle2, Bell } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../services/api';

const Subscribe = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.subscribe(formData);
      setSubmitted(true);
      toast.success('Successfully subscribed!');
    } catch (e) {
      toast.error('Subscription failed. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100 dark:border-gray-700 animate-fade-in">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 size={32} className="text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">You're Subscribed!</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Thank you, {formData.name}. You will now receive daily updates on <b>{formData.email}</b> and WhatsApp alerts on <b>{formData.whatsapp}</b>.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="text-brand-600 font-bold hover:underline"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-20">

      <div className="text-center mb-10 max-w-2xl">
        <span className="inline-block p-3 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 mb-4">
          <Bell size={24} />
        </span>
        <h1 className="text-4xl md:text-5xl font-black font-serif text-gray-900 dark:text-white mb-4">
          Stay Ahead of the Curve
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Get the latest breaking news, AI summaries, and market trends delivered straight to your inbox and WhatsApp every morning.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 md:p-10 rounded-2xl shadow-xl max-w-lg w-full border border-gray-100 dark:border-gray-700 relative overflow-hidden">
        {/* Decorative background blob */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-500 opacity-10 rounded-full blur-3xl"></div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
            <div className="relative">
              <User size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
            <div className="relative">
              <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">WhatsApp Number</label>
            <div className="relative">
              <Phone size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                name="whatsapp"
                required
                value={formData.whatsapp}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all"
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">We'll only send important breaking news alerts.</p>
          </div>

          <button
            type="submit"
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-500/30 transition-all hover:-translate-y-0.5"
          >
            Subscribe Now
          </button>
        </form>
      </div>

      <p className="mt-8 text-xs text-center text-gray-400 max-w-md">
        By subscribing, you agree to our Terms of Service and Privacy Policy. You can unsubscribe at any time.
      </p>
    </div>
  );
};

export default Subscribe;