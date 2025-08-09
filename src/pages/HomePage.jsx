import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';



// Icons components (using Lucide React would be ideal, but creating simple SVG icons)
const CheckIcon = () => (
  <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
  </svg>
);

const TrendingUpIcon = () => (
  <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-12 h-12 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
  </svg>
);

const BarChartIcon = () => (
  <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
  </svg>
);

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
  </svg>
);

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Mock auth state - replace with your actual auth store
const { user, isInitialized } = useAuthStore();
  
  const navigate = useNavigate();
const handleNavigation = (path) => navigate(path);



  const features = [
    {
      icon: <TrendingUpIcon />,
      title: "Smart Analytics",
      description: "Get intelligent insights into your financial patterns with AI-powered analytics and forecasting."
    },
    {
      icon: <ShieldIcon />,
      title: "Bank-Level Security",
      description: "Your financial data is protected with enterprise-grade encryption and security protocols."
    },
    {
      icon: <BarChartIcon />,
      title: "Real-time Reports",
      description: "Generate comprehensive financial reports and track your business performance in real-time."
    }
  ];

  const benefits = [
    "Automated expense tracking",
    "Multi-currency support",
    "Tax preparation assistance",
    "Team collaboration tools",
    "Mobile app synchronization",
    "24/7 customer support"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="relative bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  LedgerPro
                </h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-4">
                {isInitialized && user ? (
                  <button
                    onClick={() => handleNavigation('/dashboard')}
                    className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    Go to Dashboard
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleNavigation('/login')}
                      className="text-slate-700 hover:text-blue-600 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => handleNavigation('/signup')}
                      className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      Get Started
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-slate-700 hover:text-blue-600 p-2"
              >
                {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {isInitialized && user ? (
                <button
                  onClick={() => handleNavigation('/dashboard')}
                  className="block w-full text-left bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-4 py-3 rounded-lg font-medium"
                >
                  Go to Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      handleNavigation('/login');
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left text-slate-700 hover:text-blue-600 px-4 py-3 rounded-lg font-medium"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      handleNavigation('/signup');
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-4 py-3 rounded-lg font-medium"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
              Manage Your Finances
              <span className="block bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                Like a Professional
              </span>
            </h1>
            
            <p className="mt-8 text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Transform your business with our intelligent ledger management system. 
              Track expenses, generate reports, and make data-driven decisions with ease.
            </p>

            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              {isInitialized && user ? (
                <button
                  onClick={() => handleNavigation('/dashboard')}
                  className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Open Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleNavigation('/signup')}
                    className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    Start Free Trial
                  </button>
                  <button
                    onClick={() => handleNavigation('/login')}
                    className="border-2 border-slate-300 text-slate-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-blue-600 hover:text-blue-600 transition-all duration-300"
                  >
                    Sign In
                  </button>
                </>
              )}
            </div>

            {/* Trust indicators */}
            <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-slate-500">
              <div className="flex items-center space-x-2">
                <ShieldIcon />
                <span className="font-medium">256-bit SSL Encryption</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckIcon />
                <span className="font-medium">GDPR Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUpIcon />
                <span className="font-medium">99.9% Uptime</span>
              </div>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-blue-400 to-emerald-400 opacity-10 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-32 w-96 h-96 rounded-full bg-gradient-to-tr from-purple-400 to-blue-400 opacity-10 blur-3xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Everything you need to manage your ledger
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Powerful features designed to streamline your financial management and boost productivity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100"
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-8">
                Why choose LedgerPro?
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckIcon />
                    <span className="text-lg text-slate-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-3xl p-8 border border-slate-200">
                <div className="text-center">
                  <div className="text-4xl font-bold text-slate-900 mb-2">30 Days</div>
                  <div className="text-slate-600 mb-6">Free Trial</div>
                  <div className="text-2xl font-bold text-blue-600 mb-2">$0/month</div>
                  <div className="text-slate-500 mb-8">Then $29/month</div>
                  
                  {isInitialized && user ? (
                    <button
                      onClick={() => handleNavigation('/dashboard')}
                      className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                    >
                      Access Dashboard
                    </button>
                  ) : (
                    <button
                      onClick={() => handleNavigation('/signup')}
                      className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                    >
                      Start Your Free Trial
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mb-4">
              LedgerPro
            </h3>
            <p className="text-slate-400 mb-8">
              The modern way to manage your business finances
            </p>
            <div className="border-t border-slate-800 pt-8">
              <p className="text-slate-500">
                © 2025 LedgerPro. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}