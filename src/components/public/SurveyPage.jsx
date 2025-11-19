import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { surveysService } from '../../services/surveysService';

/**
 * Survey Page Placeholder
 * Loads survey data without rendering UI.
 */
export const SurveyPage = () => {
  const { slug } = useParams();

  const { data: surveys = [], isLoading: surveysLoading } = useQuery({
    queryKey: ['surveys'],
    queryFn: surveysService.getSurveys,
  });

  const survey = surveys.find((s) => s.slug === slug);

  const surveyQuery = useQuery({
    queryKey: ['survey', survey?.id],
    queryFn: () => surveysService.getSurvey(survey.id),
    enabled: !!survey?.id,
  });

    return (
    <div
      className="min-h-screen bg-white"
      data-loading={surveysLoading || surveyQuery.isLoading ? 'true' : 'false'}
    />
  );
};

