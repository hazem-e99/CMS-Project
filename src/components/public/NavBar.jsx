import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { pagesAPI } from '../../services/api';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';

/**
 * Public Navigation Bar
 * Displays pages marked as showInNavbar with dropdown support
 */
export const NavBar = () => {
  const { t, i18n } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { data: pages = [] } = useQuery({
    queryKey: ['pages'],
    queryFn: pagesAPI.getAll,
    select: (data) => data.pages || data,
  });

  // Filter visible pages for navbar
  const navbarPages = pages
    .filter(page => page.visible && page.showInNavbar)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  // Group pages by parent
  const topLevelPages = navbarPages.filter(page => !page.navbarParentId);
  const getChildren = (parentId) => 
    navbarPages.filter(page => page.navbarParentId === parentId);

  const getPageTitle = (page) => {
    return page.title?.[i18n.language] || page.title?.en || page.slug;
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center space-x-2"
            >
              <span className="text-2xl">🌐</span>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                {t('app.title')}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {topLevelPages.map(page => {
              const children = getChildren(page.id);
              
              if (children.length > 0) {
                // Dropdown menu
                return (
                  <div key={page.id} className="relative group">
                    <button className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                      {getPageTitle(page)}
                      <svg className="inline w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                      <Link
                        to={`/page/${page.slug}`}
                        className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {getPageTitle(page)}
                      </Link>
                      <div className="border-t border-gray-200 dark:border-gray-700" />
                      {children.map(child => (
                        <Link
                          key={child.id}
                          to={`/page/${child.slug}`}
                          className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          {getPageTitle(child)}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }
              
              // Regular link
              return (
                <Link
                  key={page.id}
                  to={`/page/${page.slug}`}
                  className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                >
                  {getPageTitle(page)}
                </Link>
              );
            })}
            
            <div className="border-l border-gray-300 dark:border-gray-600 h-6 mx-2" />
            
            <LanguageSwitcher />
            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <LanguageSwitcher compact />
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 dark:text-gray-300 p-2"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4">
            {topLevelPages.map(page => {
              const children = getChildren(page.id);
              
              return (
                <div key={page.id}>
                  <Link
                    to={`/page/${page.slug}`}
                    className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {getPageTitle(page)}
                  </Link>
                  {children.map(child => (
                    <Link
                      key={child.id}
                      to={`/page/${child.slug}`}
                      className="block pl-6 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {getPageTitle(child)}
                    </Link>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
};

