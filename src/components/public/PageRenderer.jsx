import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { pagesAPI } from '../../services/api';
import { SectionRenderer } from './SectionRenderer';
import { Loading } from '../ui/Loading';

/**
 * Page Renderer Component
 * Renders a dynamic page with its sections
 */
export const PageRenderer = () => {
  const { slug } = useParams();
  const { i18n } = useTranslation();

  // Fetch all pages to find the one with matching slug
  const { data: pages, isLoading: pagesLoading } = useQuery({
    queryKey: ['pages'],
    queryFn: pagesAPI.getAll,
    select: (data) => data.pages || data,
  });

  // Find page by slug
  const page = pages?.find(p => p.slug === slug);

  // Fetch full page data with sections
  const { data: pageData, isLoading: pageLoading } = useQuery({
    queryKey: ['page', page?.id],
    queryFn: () => pagesAPI.getById(page.id),
    enabled: !!page?.id,
  });

  if (pagesLoading || pageLoading) {
    return <Loading size="lg" text="Loading page..." />;
  }

  if (!page || !pageData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            404 - Page Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            The page you're looking for doesn't exist.
          </p>
          <a
            href="/"
            className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }

  const pageTitle = page.title?.[i18n.language] || page.title?.en || page.slug;
  const sections = pageData.sectionsData || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Page Title (optional, can be removed if sections handle titles) */}
      {/* <div className="bg-white dark:bg-gray-800 py-8 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {pageTitle}
          </h1>
        </div>
      </div> */}

      {/* Render Sections */}
      {sections.length > 0 ? (
        sections.map(section => (
          <SectionRenderer key={section.id} section={section} />
        ))
      ) : (
        <div className="py-16 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            This page has no content yet.
          </p>
        </div>
      )}
    </div>
  );
};

