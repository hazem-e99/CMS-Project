import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { pagesService } from '../../services/pagesService';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input, Select, Checkbox } from '../ui/Input';
import { Tabs } from '../ui/Tabs';
import { SectionList } from './SectionList';
import { SectionEditorModal } from './SectionEditorModal';
import { Loading } from '../ui/Loading';

/**
 * Page Editor Component
 * Create/Edit pages and manage their sections
 */
export const PageEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const isNew = id === 'new';

  const [formData, setFormData] = useState({
    slug: '',
    title: { en: '', ar: '', ku: '' },
    visible: true,
    showInNavbar: true,
    navbarParentId: null,
  });

  const [editingSection, setEditingSection] = useState(null);
  const [isCreatingSection, setIsCreatingSection] = useState(false);

  // Fetch page data
  const { isLoading } = useQuery({
    queryKey: ['page', id],
    queryFn: () => pagesService.getPage(id),
    enabled: !isNew,
    onSuccess: (data) => {
      setFormData({
        slug: data.slug || '',
        title: data.title || { en: '', ar: '', ku: '' },
        visible: data.visible ?? true,
        showInNavbar: data.showInNavbar ?? true,
        navbarParentId: data.navbarParentId || null,
      });
    },
  });

  // Fetch all pages for parent selection
  const { data: allPages = [] } = useQuery({
    queryKey: ['pages'],
    queryFn: pagesService.getPages,
  });

  const saveMutation = useMutation({
    mutationFn: (data) => (isNew ? pagesService.createPage(data) : pagesService.updatePage(id, data)),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['pages']);
      queryClient.invalidateQueries(['page', id]);
      if (isNew) {
        navigate(`/admin/pages/${data.id}`);
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const handleTitleChange = (lang, value) => {
    setFormData(prev => ({
      ...prev,
      title: { ...prev.title, [lang]: value },
    }));
  };

  const parentOptions = [
    { value: '', label: t('pages.noParent') },
    ...allPages
      .filter(p => p.id !== id)
      .map(p => ({
        value: p.id,
        label: p.title?.en || p.slug,
      })),
  ];

  if (isLoading && !isNew) {
    return <Loading text="Loading page..." />;
  }

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'ar', label: 'العربية' },
    { value: 'ku', label: 'کوردی' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Settings */}
      <Card
        header={
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isNew ? t('pages.create') : t('pages.edit')}
          </h2>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Page Slug */}
          <Input
            label={t('pages.slug')}
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="about-us"
            required
          />

          {/* Page Title (Multi-language) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('sections.content.title')} *
            </label>
            <Tabs tabs={languages}>
              {(activeLang) => (
                <Input
                  value={formData.title[activeLang]}
                  onChange={(e) => handleTitleChange(activeLang, e.target.value)}
                  placeholder={`Title in ${languages.find(l => l.value === activeLang)?.label}`}
                  required={activeLang === 'en'}
                />
              )}
            </Tabs>
          </div>

          {/* Parent Page */}
          <Select
            label={t('pages.parent')}
            value={formData.navbarParentId || ''}
            onChange={(e) => setFormData({ ...formData, navbarParentId: e.target.value || null })}
            options={parentOptions}
          />

          {/* Checkboxes */}
          <div className="flex gap-6">
            <Checkbox
              label={t('pages.visible')}
              checked={formData.visible}
              onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
            />
            <Checkbox
              label={t('pages.showInNavbar')}
              checked={formData.showInNavbar}
              onChange={(e) => setFormData({ ...formData, showInNavbar: e.target.checked })}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button type="submit" loading={saveMutation.isLoading}>
              {t('app.save')}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/admin/pages')}>
              {t('app.cancel')}
            </Button>
          </div>
        </form>
      </Card>

      {/* Sections Management */}
      {!isNew && (
        <Card
          header={
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('sections.title')}
              </h2>
              <Button onClick={() => setIsCreatingSection(true)}>
                {t('pages.addSection')}
              </Button>
            </div>
          }
        >
          <SectionList
            pageId={id}
            onEdit={(section) => setEditingSection(section)}
          />
        </Card>
      )}

      {/* Section Editor Modal */}
      {(isCreatingSection || editingSection) && (
        <SectionEditorModal
          section={editingSection}
          pageId={id}
          isOpen={true}
          onClose={() => {
            setIsCreatingSection(false);
            setEditingSection(null);
          }}
        />
      )}
    </div>
  );
};

