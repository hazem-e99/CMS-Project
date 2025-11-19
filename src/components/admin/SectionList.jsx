import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { sectionsAPI } from '../../services/api';
import { Button } from '../ui/Button';
import { ConfirmDialog } from '../ui/Modal';
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
 * Section List Component
 * Displays sections with drag-to-reorder
 */
export const SectionList = ({ pageId, onEdit }) => {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState(null);

  const { data: sections = [], isLoading } = useQuery({
    queryKey: ['sections', pageId],
    queryFn: () => sectionsAPI.getAll(pageId),
    select: (data) => {
      const sectionList = data.sections || data;
      return sectionList.sort((a, b) => (a.order || 0) - (b.order || 0));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: sectionsAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['sections', pageId]);
      queryClient.invalidateQueries(['page', pageId]);
      setDeleteId(null);
    },
  });

  const reorderMutation = useMutation({
    mutationFn: sectionsAPI.reorder,
    onSuccess: () => {
      queryClient.invalidateQueries(['sections', pageId]);
      queryClient.invalidateQueries(['page', pageId]);
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
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);

      const reorderedSections = arrayMove(sections, oldIndex, newIndex);

      // Prepare reorder data
      const reorderData = reorderedSections.map((section, index) => ({
        id: section.id,
        order: index + 1,
      }));

      reorderMutation.mutate(reorderData);
    }
  };

  const getSectionTitle = (section) => {
    const title = section.content?.title;
    if (typeof title === 'object') {
      return title[i18n.language] || title.en || 'Untitled';
    }
    return title || 'Untitled';
  };

  if (isLoading) {
    return <div>Loading sections...</div>;
  }

  if (sections.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        No sections yet. Add your first section!
      </div>
    );
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sections.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {sections.map((section) => (
              <SectionRow
                key={section.id}
                section={section}
                getSectionTitle={getSectionTitle}
                onEdit={() => onEdit(section)}
                onDelete={() => setDeleteId(section.id)}
                t={t}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteMutation.mutate(deleteId)}
        title={t('sections.delete')}
        message={t('sections.deleteConfirm')}
        confirmText={t('app.delete')}
        cancelText={t('app.cancel')}
      />
    </>
  );
};

// Sortable Section Row
const SectionRow = ({ section, getSectionTitle, onEdit, onDelete, t }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const sectionTypeLabel = t(`sections.types.${section.type}`) || section.type;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </button>

      {/* Section Info */}
      <div className="flex-1">
        <div className="font-semibold text-gray-900 dark:text-white">
          {getSectionTitle(section)}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {sectionTypeLabel}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={onEdit}>
          {t('app.edit')}
        </Button>
        <Button size="sm" variant="danger" onClick={onDelete}>
          {t('app.delete')}
        </Button>
      </div>
    </div>
  );
};

