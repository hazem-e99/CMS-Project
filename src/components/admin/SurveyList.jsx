import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { surveysService } from '../../services/surveysService';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ConfirmDialog } from '../ui/Modal';
import { copyToClipboard } from '../../utils/share';
import { Loading } from '../ui/Loading';

/**
 * Survey List Component
 * Displays all surveys with CRUD operations
 */
export const SurveyList = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState(null);

  const { data: surveys = [], isLoading } = useQuery({
    queryKey: ['surveys'],
    queryFn: surveysService.getSurveys,
  });

  const deleteMutation = useMutation({
    mutationFn: surveysService.deleteSurvey,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['surveys'] });
      const previousSurveys = queryClient.getQueryData(['surveys']) || [];
      queryClient.setQueryData(['surveys'], (old = []) => old.filter((survey) => survey.id !== id));
      return { previousSurveys };
    },
    onError: (_error, _vars, context) => {
      if (context?.previousSurveys) {
        queryClient.setQueryData(['surveys'], context.previousSurveys);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
      setDeleteId(null);
    },
  });

  const handleCopyLink = async (slug) => {
    const url = `${window.location.origin}/survey/${slug}`;
    const success = await copyToClipboard(url);
    if (success) {
      alert(t('surveys.linkCopied'));
    }
  };

  const getSurveyTitle = (survey) => {
    return survey.title?.[i18n.language] || survey.title?.en || survey.slug;
  };

  if (isLoading) {
    return <Loading text="Loading surveys..." />;
  }

  return (
    <div>
      <Card
        header={
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('surveys.title')}
            </h2>
            <Button onClick={() => navigate('/admin/surveys/new')}>
              {t('surveys.create')}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          {surveys.map((survey) => (
            <div
              key={survey.id}
              className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex-1">
                <div className="font-semibold text-gray-900 dark:text-white">
                  {getSurveyTitle(survey)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  /survey/{survey.slug}
                  {survey.isPublic && (
                    <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs rounded">
                      Public
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopyLink(survey.slug)}
                >
                  {t('surveys.copyLink')}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/admin/surveys/${survey.id}/responses`)}
                >
                  {t('surveys.viewResponses')}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/admin/surveys/${survey.id}`)}
                >
                  {t('app.edit')}
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => setDeleteId(survey.id)}
                >
                  {t('app.delete')}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {surveys.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No surveys yet. Create your first survey!
          </div>
        )}
      </Card>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteMutation.mutate(deleteId)}
        title={t('surveys.delete')}
        message={t('surveys.deleteConfirm')}
        confirmText={t('app.delete')}
        cancelText={t('app.cancel')}
      />
    </div>
  );
};

