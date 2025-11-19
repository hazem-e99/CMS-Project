import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { surveysAPI } from '../../services/api';
import { Button } from '../ui/Button';
import { Input, Textarea, Checkbox } from '../ui/Input';
import { Loading } from '../ui/Loading';

/**
 * Public Survey Page
 * Allows users to fill out and submit surveys
 */
export const SurveyPage = () => {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  // Fetch all surveys to find by slug
  const { data: surveys } = useQuery({
    queryKey: ['surveys'],
    queryFn: surveysAPI.getAll,
    select: (data) => data.surveys || data,
  });

  const survey = surveys?.find(s => s.slug === slug);

  // Fetch full survey data
  const { data: surveyData, isLoading } = useQuery({
    queryKey: ['survey', survey?.id],
    queryFn: () => surveysAPI.getById(survey.id),
    enabled: !!survey?.id,
  });

  const submitMutation = useMutation({
    mutationFn: (data) => surveysAPI.submitResponse(surveyData.id, data),
    onSuccess: () => {
      setSubmitted(true);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required questions
    const isValid = surveyData.questions.every((question, index) => {
      if (!question.required) return true;
      const answer = answers[index];
      if (question.type === 'multi-choice') {
        return Array.isArray(answer) && answer.length > 0;
      }
      return answer && answer.trim() !== '';
    });

    if (!isValid) {
      alert('Please answer all required questions');
      return;
    }

    submitMutation.mutate({ answers });
  };

  const handleAnswerChange = (questionIndex, value) => {
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[questionIndex] = value;
      return newAnswers;
    });
  };

  const handleMultiChoiceChange = (questionIndex, optionId, checked) => {
    setAnswers(prev => {
      const newAnswers = [...prev];
      const currentAnswers = newAnswers[questionIndex] || [];
      
      if (checked) {
        newAnswers[questionIndex] = [...currentAnswers, optionId];
      } else {
        newAnswers[questionIndex] = currentAnswers.filter(id => id !== optionId);
      }
      
      return newAnswers;
    });
  };

  if (isLoading) {
    return <Loading size="lg" text="Loading survey..." />;
  }

  if (!survey || !surveyData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Survey Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            The survey you're looking for doesn't exist or is not public.
          </p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-2xl mx-auto text-center p-8">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {t('surveys.submitSuccess')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Thank you for your response!
          </p>
          <Button onClick={() => window.location.href = '/'}>
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  const surveyTitle = surveyData.title?.[i18n.language] || surveyData.title?.en || surveyData.slug;
  const surveyDescription = surveyData.description?.[i18n.language] || surveyData.description?.en;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {surveyTitle}
          </h1>
          {surveyDescription && (
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              {surveyDescription}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {surveyData.questions?.map((question, index) => {
              const questionText = question.question?.[i18n.language] || question.question?.en;
              
              return (
                <div key={index} className="space-y-3">
                  <label className="block text-lg font-medium text-gray-900 dark:text-white">
                    {index + 1}. {questionText}
                    {question.required && <span className="text-red-500 ml-1">*</span>}
                  </label>

                  {question.type === 'text' && (
                    <Textarea
                      value={answers[index] || ''}
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                      required={question.required}
                      rows={3}
                    />
                  )}

                  {question.type === 'single-choice' && (
                    <div className="space-y-2">
                      {question.options?.map(option => {
                        const optionText = option.text?.[i18n.language] || option.text?.en;
                        return (
                          <label key={option.id} className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name={`question-${index}`}
                              value={option.id}
                              checked={answers[index] === option.id}
                              onChange={(e) => handleAnswerChange(index, e.target.value)}
                              required={question.required}
                              className="w-4 h-4 text-blue-600 mr-3"
                            />
                            <span className="text-gray-700 dark:text-gray-300">{optionText}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {question.type === 'multi-choice' && (
                    <div className="space-y-2">
                      {question.options?.map(option => {
                        const optionText = option.text?.[i18n.language] || option.text?.en;
                        const isChecked = (answers[index] || []).includes(option.id);
                        return (
                          <label key={option.id} className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => handleMultiChoiceChange(index, option.id, e.target.checked)}
                              className="w-4 h-4 text-blue-600 mr-3"
                            />
                            <span className="text-gray-700 dark:text-gray-300">{optionText}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            <div className="pt-6">
              <Button
                type="submit"
                size="lg"
                loading={submitMutation.isLoading}
                className="w-full"
              >
                {t('surveys.submit')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

