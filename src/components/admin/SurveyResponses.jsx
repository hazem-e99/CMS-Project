import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { surveysAPI } from '../../services/api';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { exportToCSV, formatSurveyResponsesForCSV } from '../../utils/csvExport';

/**
 * Survey Responses Component
 * Displays survey responses with analytics and CSV export
 */
export const SurveyResponses = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const { data: survey, isLoading: surveyLoading } = useQuery({
    queryKey: ['survey', id],
    queryFn: () => surveysAPI.getById(id),
  });

  const { data: responses = [], isLoading: responsesLoading } = useQuery({
    queryKey: ['survey-responses', id],
    queryFn: () => surveysAPI.getResponses(id),
    select: (data) => data.surveyResponses || data,
  });

  const handleExportCSV = () => {
    if (!survey || responses.length === 0) return;
    
    const formattedData = formatSurveyResponsesForCSV(responses, survey);
    const surveyTitle = survey.title?.[i18n.language] || survey.title?.en || survey.slug;
    exportToCSV(formattedData, `${surveyTitle}-responses.csv`);
  };

  if (surveyLoading || responsesLoading) {
    return <div>Loading...</div>;
  }

  if (!survey) {
    return <div>Survey not found</div>;
  }

  const surveyTitle = survey.title?.[i18n.language] || survey.title?.en || survey.slug;

  // Calculate analytics for choice questions
  const analytics = survey.questions?.map((question, qIndex) => {
    if (question.type === 'text') return null;

    const answers = responses.map(r => r.answers[qIndex]).filter(Boolean);
    
    if (question.type === 'single-choice') {
      const counts = {};
      question.options?.forEach(opt => {
        counts[opt.id] = answers.filter(a => a === opt.id).length;
      });
      return { question, counts, total: answers.length };
    }
    
    if (question.type === 'multi-choice') {
      const counts = {};
      question.options?.forEach(opt => {
        counts[opt.id] = answers.filter(a => Array.isArray(a) && a.includes(opt.id)).length;
      });
      return { question, counts, total: answers.length };
    }

    return null;
  }).filter(Boolean);

  return (
    <div className="space-y-6">
      <Card
        header={
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {surveyTitle}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('surveys.responsesCount', { count: responses.length })}
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleExportCSV} disabled={responses.length === 0}>
                {t('surveys.exportCSV')}
              </Button>
              <Button variant="outline" onClick={() => navigate(`/admin/surveys/${id}`)}>
                {t('app.edit')}
              </Button>
              <Button variant="outline" onClick={() => navigate('/admin/surveys')}>
                {t('app.back')}
              </Button>
            </div>
          </div>
        }
      >
        {responses.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            {t('surveys.noResponses')}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Analytics for choice questions */}
            {analytics.map((item, index) => {
              const questionText = item.question.question?.[i18n.language] || item.question.question?.en;
              
              return (
                <div key={index} className="space-y-4">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                    {questionText}
                  </h3>
                  <div className="space-y-2">
                    {item.question.options?.map(option => {
                      const count = item.counts[option.id] || 0;
                      const percentage = item.total > 0 ? (count / item.total * 100).toFixed(1) : 0;
                      const optionText = option.text?.[i18n.language] || option.text?.en;
                      
                      return (
                        <div key={option.id} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-700 dark:text-gray-300">{optionText}</span>
                            <span className="text-gray-500 dark:text-gray-400">
                              {count} ({percentage}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* All Responses Table */}
            <div className="mt-8">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">
                All Responses
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-2 text-left">#</th>
                      <th className="px-4 py-2 text-left">Submitted At</th>
                      {survey.questions?.map((q, i) => (
                        <th key={i} className="px-4 py-2 text-left">
                          Q{i + 1}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {responses.map((response, rIndex) => (
                      <tr key={response.id} className="border-b border-gray-200 dark:border-gray-700">
                        <td className="px-4 py-2">{rIndex + 1}</td>
                        <td className="px-4 py-2">
                          {new Date(response.submittedAt).toLocaleString()}
                        </td>
                        {response.answers.map((answer, aIndex) => {
                          const question = survey.questions[aIndex];
                          let displayAnswer = answer;
                          
                          if (question?.type === 'single-choice') {
                            const option = question.options?.find(opt => opt.id === answer);
                            displayAnswer = option?.text?.[i18n.language] || option?.text?.en || answer;
                          } else if (question?.type === 'multi-choice' && Array.isArray(answer)) {
                            displayAnswer = answer.map(id => {
                              const option = question.options?.find(opt => opt.id === id);
                              return option?.text?.[i18n.language] || option?.text?.en || id;
                            }).join(', ');
                          }
                          
                          return (
                            <td key={aIndex} className="px-4 py-2 max-w-xs truncate">
                              {displayAnswer || '-'}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

