import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { pagesService } from '../../services/pagesService';
import { sectionsService } from '../../services/sectionsService';

/**
 * Page Renderer Placeholder
 * Loads backend data without rendering UI so the public site stays blank.
 */
export const PageRenderer = () => {
  const { slug } = useParams();

  const { data: pages = [], isLoading: pagesLoading } = useQuery({
    queryKey: ['pages'],
    queryFn: pagesService.getPages,
  });

  const page = pages.find((p) => p.slug === slug);

  const pageQuery = useQuery({
    queryKey: ['page', page?.id],
    queryFn: () => pagesService.getPage(page.id),
    enabled: !!page?.id,
  });

  const sectionsQuery = useQuery({
    queryKey: ['sections', page?.id],
    queryFn: () => sectionsService.getSectionsByPage(page.id),
    enabled: !!page?.id,
  });

  const isHydrating = pagesLoading || pageQuery.isLoading || sectionsQuery.isLoading;

  return (
    <div
      className="min-h-screen bg-white"
      data-loading={isHydrating ? 'true' : 'false'}
    />
  );
};

