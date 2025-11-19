import React, { useState, useEffect, useTransition } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { sectionsService } from '../../services/sectionsService';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input, Select } from '../ui/Input';
import { Tabs } from '../ui/Tabs';
import { RichTextEditor } from '../ui/RichTextEditor';
import { ImageUpload } from '../ui/ImageUpload';

/**
 * Section Editor Modal
 * Create/Edit sections with multi-language support
 */
export const SectionEditorModal = ({ section, pageId, isOpen, onClose }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const isNew = !section;

  const createDefaultFormData = () => ({
    type: 'header',
    content: {
      title: { en: '', ar: '', ku: '' },
      details: { en: '', ar: '', ku: '' },
      image: null,
      button: {
        text: { en: '', ar: '', ku: '' },
        link: '',
      },
      shareText: { en: '', ar: '', ku: '' },
      features: [],
      testimonials: [],
      faqs: [],
    },
    layout: {
      imagePosition: 'left',
      bg: 'white',
      padding: 'md',
      textAlign: 'left',
      backgroundImage: null,
    },
  });

  const [formData, setFormData] = useState(createDefaultFormData);
  const [, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      if (section) {
        setFormData({
          type: section.type || 'header',
          content: { ...createDefaultFormData().content, ...(section.content || {}) },
          layout: { ...createDefaultFormData().layout, ...(section.layout || {}) },
        });
      } else {
        setFormData(createDefaultFormData());
      }
    });
  }, [section, startTransition]);

  const saveMutation = useMutation({
    mutationFn: (data) => {
      const payload = {
        ...data,
        pageId,
      };
      return isNew
        ? sectionsService.createSection(payload)
        : sectionsService.updateSection(section.id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections', pageId] });
      queryClient.invalidateQueries({ queryKey: ['page', pageId] });
      onClose();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const handleContentChange = (lang, field, value) => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [field]: {
          ...prev.content[field],
          [lang]: value,
        },
      },
    }));
  };

  const handleButtonChange = (lang, value) => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        button: {
          ...prev.content.button,
          text: {
            ...prev.content.button.text,
            [lang]: value,
          },
        },
      },
    }));
  };

  const handleButtonLinkChange = (value) => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        button: {
          ...prev.content.button,
          link: value,
        },
      },
    }));
  };

  const sectionTypes = [
    { value: 'hero', label: t('sections.types.hero') },
    { value: 'header', label: t('sections.types.header') },
    { value: 'image-left', label: t('sections.types.image-left') },
    { value: 'image-right', label: t('sections.types.image-right') },
    { value: 'cta', label: t('sections.types.cta') },
    { value: 'features', label: t('sections.types.features') },
    { value: 'testimonials', label: t('sections.types.testimonials') },
    { value: 'faq', label: t('sections.types.faq') },
    { value: 'rich', label: t('sections.types.rich') },
  ];

  const backgroundOptions = [
    { value: 'white', label: t('sections.layout.backgrounds.white') },
    { value: 'light', label: t('sections.layout.backgrounds.light') },
    { value: 'dark', label: t('sections.layout.backgrounds.dark') },
    { value: 'gradient', label: t('sections.layout.backgrounds.gradient') },
    { value: 'image', label: t('sections.layout.backgrounds.image') },
  ];

  const paddingOptions = [
    { value: 'sm', label: t('sections.layout.paddings.sm') },
    { value: 'md', label: t('sections.layout.paddings.md') },
    { value: 'lg', label: t('sections.layout.paddings.lg') },
    { value: 'xl', label: t('sections.layout.paddings.xl') },
  ];

  const textAlignOptions = [
    { value: 'left', label: t('sections.layout.aligns.left') },
    { value: 'center', label: t('sections.layout.aligns.center') },
    { value: 'right', label: t('sections.layout.aligns.right') },
  ];

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'ar', label: 'العربية' },
    { value: 'ku', label: 'کوردی' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isNew ? t('sections.create') : t('sections.edit')}
      size="xl"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            {t('app.cancel')}
          </Button>
          <Button onClick={handleSubmit} loading={saveMutation.isLoading}>
            {t('app.save')}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section Type */}
        <Select
          label={t('sections.type')}
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          options={sectionTypes}
          required
        />

        {/* Title (Multi-language) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('sections.content.title')}
          </label>
          <Tabs tabs={languages}>
            {(activeLang) => (
              <Input
                value={formData.content.title[activeLang] || ''}
                onChange={(e) => handleContentChange(activeLang, 'title', e.target.value)}
                placeholder={`Title in ${languages.find(l => l.value === activeLang)?.label}`}
              />
            )}
          </Tabs>
        </div>

        {/* Details (Multi-language Rich Text) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('sections.content.details')}
          </label>
          <Tabs tabs={languages}>
            {(activeLang) => (
              <RichTextEditor
                value={formData.content.details[activeLang] || ''}
                onChange={(value) => handleContentChange(activeLang, 'details', value)}
                placeholder={`Details in ${languages.find(l => l.value === activeLang)?.label}`}
              />
            )}
          </Tabs>
        </div>

        {/* Image Upload (for relevant section types) */}
        {['hero', 'header', 'image-left', 'image-right'].includes(formData.type) && (
          <ImageUpload
            label={t('sections.content.image')}
            value={formData.content.image}
            onChange={(value) => setFormData(prev => ({
              ...prev,
              content: { ...prev.content, image: value },
            }))}
          />
        )}

        {/* Button (Multi-language) */}
        {['hero', 'header', 'image-left', 'image-right', 'cta'].includes(formData.type) && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('sections.content.buttonText')}
              </label>
              <Tabs tabs={languages}>
                {(activeLang) => (
                  <Input
                    value={formData.content.button.text[activeLang] || ''}
                    onChange={(e) => handleButtonChange(activeLang, e.target.value)}
                    placeholder={`Button text in ${languages.find(l => l.value === activeLang)?.label}`}
                  />
                )}
              </Tabs>
            </div>
            <Input
              label={t('sections.content.buttonLink')}
              value={formData.content.button.link || ''}
              onChange={(e) => handleButtonLinkChange(e.target.value)}
              placeholder="/contact"
            />
          </div>
        )}

        {/* Share Text (Multi-language) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('sections.content.shareText')}
          </label>
          <Tabs tabs={languages}>
            {(activeLang) => (
              <Input
                value={formData.content.shareText[activeLang] || ''}
                onChange={(e) => handleContentChange(activeLang, 'shareText', e.target.value)}
                placeholder={`Share text in ${languages.find(l => l.value === activeLang)?.label}`}
              />
            )}
          </Tabs>
        </div>

        {/* Layout Settings */}
        <div className="grid grid-cols-3 gap-4">
          <Select
            label={t('sections.layout.bg')}
            value={formData.layout.bg}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              layout: { ...prev.layout, bg: e.target.value },
            }))}
            options={backgroundOptions}
          />
          <Select
            label={t('sections.layout.padding')}
            value={formData.layout.padding}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              layout: { ...prev.layout, padding: e.target.value },
            }))}
            options={paddingOptions}
          />
          <Select
            label={t('sections.layout.textAlign')}
            value={formData.layout.textAlign}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              layout: { ...prev.layout, textAlign: e.target.value },
            }))}
            options={textAlignOptions}
          />
        </div>

        {formData.layout.bg === 'image' && (
          <ImageUpload
            label={t('sections.layout.backgroundImage')}
            value={formData.layout.backgroundImage}
            onChange={(value) => setFormData(prev => ({
              ...prev,
              layout: { ...prev.layout, backgroundImage: value },
            }))}
          />
        )}

        {/* Note: Features, Testimonials, and FAQ editors would need more complex UI */}
        {/* For simplicity, they're managed through JSON in this implementation */}
        {/* A full implementation would have dedicated editors for these */}
      </form>
    </Modal>
  );
};

