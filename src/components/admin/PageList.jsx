import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { pagesAPI } from '../../services/api';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ConfirmDialog } from '../ui/Modal';
import { Checkbox } from '../ui/Input';
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
 * Page List Component
 * Displays all pages with CRUD operations and drag-to-reorder
 */
export const PageList = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState(null);

  const { data: pages = [], isLoading } = useQuery({
    queryKey: ['pages'],
    queryFn: pagesAPI.getAll,
    select: (data) => {
      const pageList = data.pages || data;
      return pageList.sort((a, b) => (a.order || 0) - (b.order || 0));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: pagesAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['pages']);
      setDeleteId(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => pagesAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['pages']);
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
      const oldIndex = pages.findIndex((p) => p.id === active.id);
      const newIndex = pages.findIndex((p) => p.id === over.id);

      const reorderedPages = arrayMove(pages, oldIndex, newIndex);

      // Update orders
      reorderedPages.forEach((page, index) => {
        if (page.order !== index + 1) {
          updateMutation.mutate({
            id: page.id,
            data: { ...page, order: index + 1 },
          });
        }
      });
    }
  };

  const handleToggleVisible = (page) => {
    updateMutation.mutate({
      id: page.id,
      data: { ...page, visible: !page.visible },
    });
  };

  const handleToggleNavbar = (page) => {
    updateMutation.mutate({
      id: page.id,
      data: { ...page, showInNavbar: !page.showInNavbar },
    });
  };

  const getPageTitle = (page) => {
    return page.title?.[i18n.language] || page.title?.en || page.slug;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Card
        header={
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('pages.title')}
            </h2>
            <Button onClick={() => navigate('/admin/pages/new')}>
              {t('pages.create')}
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
            items={pages.map((p) => p.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {pages.map((page) => (
                <PageRow
                  key={page.id}
                  page={page}
                  getPageTitle={getPageTitle}
                  onToggleVisible={handleToggleVisible}
                  onToggleNavbar={handleToggleNavbar}
                  onEdit={() => navigate(`/admin/pages/${page.id}`)}
                  onDelete={() => setDeleteId(page.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {pages.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No pages yet. Create your first page!
          </div>
        )}
      </Card>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteMutation.mutate(deleteId)}
        title={t('pages.delete')}
        message={t('pages.deleteConfirm')}
        confirmText={t('app.delete')}
        cancelText={t('app.cancel')}
      />
    </div>
  );
};

// Sortable Page Row Component
const PageRow = ({
  page,
  getPageTitle,
  onToggleVisible,
  onToggleNavbar,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: page.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

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

      {/* Page Info */}
      <div className="flex-1">
        <div className="font-semibold text-gray-900 dark:text-white">
          {getPageTitle(page)}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          /{page.slug}
        </div>
      </div>

      {/* Toggles */}
      <div className="flex items-center gap-4">
        <Checkbox
          checked={page.visible}
          onChange={() => onToggleVisible(page)}
          label={t('pages.visible')}
        />
        <Checkbox
          checked={page.showInNavbar}
          onChange={() => onToggleNavbar(page)}
          label={t('pages.showInNavbar')}
        />
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

