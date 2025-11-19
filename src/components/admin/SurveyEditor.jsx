import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { surveysAPI } from '../../services/api';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input, Textarea, Select, Checkbox } from '../ui/Input';
import { Tabs } from '../ui/Tabs';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

/**
 * Survey Editor Component
 * Create/Edit surveys with questions
 */
export const SurveyEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const isNew = id === 'new';

  const [formData, setFormData] = useState({
    slug: '',
    title: { en: '', ar: '', ku: '' },
    description: { en: '', ar: '', ku: '' },
    isPublic: true,
    questions: [],
  });

  const { data: surveyData, isLoading } = useQuery({
    queryKey: ['survey', id],
    queryFn: () => surveysAPI.getById(id),
    enabled: !isNew,
    onSuccess: (data) => {
      setFormData({
        slug: data.slug || '',
        title: data.title || { en: '', ar: '', ku: '' },
        description: data.description || { en: '', ar: '', ku: '' },
        isPublic: data.isPublic ?? true,
        questions: data.questions || [],
      });
    },
  });

  const saveMutation = useMutation({
    mutationFn: (data) => isNew ? surveysAPI.create(data) : surveysAPI.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['surveys']);
      queryClient.invalidateQueries(['survey', id]);
      if (isNew) {
        navigate(`/admin/surveys/${data.id || data.survey?.id}`);
      }
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setFormData(prev => {
        const oldIndex = prev.questions.findIndex((q) => q.id === active.id);
        const newIndex = prev.questions.findIndex((q) => q.id === over.id);
        return {
          ...prev,
          questions: arrayMove(prev.questions, oldIndex, newIndex),
        };
      });
    }
  };

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

  const handleDescriptionChange = (lang, value) => {
    setFormData(prev => ({
      ...prev,
      description: { ...prev.description, [lang]: value },
    }));
  };

  const addQuestion = () => {
    const newQuestion = {
      id: `q-${Date.now()}`,
      type: 'text',
      question: { en: '', ar: '', ku: '' },
      required: false,
      options: [],
    };
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
  };

  const updateQuestion = (questionId, updates) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId ? { ...q, ...updates } : q
      ),
    }));
  };

  const deleteQuestion = (questionId) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId),
    }));
  };

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'ar', label: 'العربية' },
    { value: 'ku', label: 'کوردی' },
  ];

  if (isLoading && !isNew) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card
        header={
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isNew ? t('surveys.create') : t('surveys.edit')}
          </h2>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label={t('surveys.slug')}
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="customer-satisfaction"
            required
          />

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

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('surveys.description')}
            </label>
            <Tabs tabs={languages}>
              {(activeLang) => (
                <Textarea
                  value={formData.description[activeLang]}
                  onChange={(e) => handleDescriptionChange(activeLang, e.target.value)}
                  placeholder={`Description in ${languages.find(l => l.value === activeLang)?.label}`}
                />
              )}
            </Tabs>
          </div>

          <Checkbox
            label={t('surveys.isPublic')}
            checked={formData.isPublic}
            onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
          />

          <div className="flex gap-3">
            <Button type="submit" loading={saveMutation.isLoading}>
              {t('app.save')}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/admin/surveys')}>
              {t('app.cancel')}
            </Button>
          </div>
        </form>
      </Card>

      {/* Questions */}
      <Card
        header={
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {t('surveys.questions')}
            </h3>
            <Button onClick={addQuestion}>
              {t('surveys.addQuestion')}
            </Button>
          </div>
        }
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={formData.questions.map((q) => q.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {formData.questions.map((question, index) => (
                <QuestionEditor
                  key={question.id}
                  question={question}
                  index={index}
                  onUpdate={(updates) => updateQuestion(question.id, updates)}
                  onDelete={() => deleteQuestion(question.id)}
                  languages={languages}
                  t={t}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {formData.questions.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No questions yet. Add your first question!
          </div>
        )}
      </Card>
    </div>
  );
};

// Question Editor Component
const QuestionEditor = ({ question, index, onUpdate, onDelete, languages, t }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const questionTypes = [
    { value: 'text', label: t('surveys.questionTypes.text') },
    { value: 'single-choice', label: t('surveys.questionTypes.single-choice') },
    { value: 'multi-choice', label: t('surveys.questionTypes.multi-choice') },
  ];

  const addOption = () => {
    const newOption = {
      id: `opt-${Date.now()}`,
      text: { en: '', ar: '', ku: '' },
    };
    onUpdate({
      options: [...(question.options || []), newOption],
    });
  };

  const updateOption = (optionId, lang, value) => {
    onUpdate({
      options: question.options.map(opt =>
        opt.id === optionId
          ? { ...opt, text: { ...opt.text, [lang]: value } }
          : opt
      ),
    });
  };

  const deleteOption = (optionId) => {
    onUpdate({
      options: question.options.filter(opt => opt.id !== optionId),
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-4"
    >
      <div className="flex items-start gap-4">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 mt-6"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </button>

        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-900 dark:text-white">
              Question {index + 1}
            </span>
            <Button size="sm" variant="danger" onClick={onDelete}>
              {t('app.delete')}
            </Button>
          </div>

          <Select
            label={t('surveys.question.type')}
            value={question.type}
            onChange={(e) => onUpdate({ type: e.target.value })}
            options={questionTypes}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('surveys.question.text')} *
            </label>
            <Tabs tabs={languages}>
              {(activeLang) => (
                <Input
                  value={question.question[activeLang] || ''}
                  onChange={(e) =>
                    onUpdate({
                      question: {
                        ...question.question,
                        [activeLang]: e.target.value,
                      },
                    })
                  }
                  placeholder={`Question in ${languages.find(l => l.value === activeLang)?.label}`}
                />
              )}
            </Tabs>
          </div>

          <Checkbox
            label={t('surveys.question.required')}
            checked={question.required}
            onChange={(e) => onUpdate({ required: e.target.checked })}
          />

          {/* Options for choice questions */}
          {['single-choice', 'multi-choice'].includes(question.type) && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('surveys.question.options')}
                </label>
                <Button size="sm" variant="outline" onClick={addOption}>
                  {t('surveys.question.addOption')}
                </Button>
              </div>
              {(question.options || []).map((option) => (
                <div key={option.id} className="flex items-center gap-2">
                  <div className="flex-1">
                    <Tabs tabs={languages}>
                      {(activeLang) => (
                        <Input
                          value={option.text[activeLang] || ''}
                          onChange={(e) => updateOption(option.id, activeLang, e.target.value)}
                          placeholder={`Option in ${languages.find(l => l.value === activeLang)?.label}`}
                        />
                      )}
                    </Tabs>
                  </div>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => deleteOption(option.id)}
                  >
                    ✕
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

