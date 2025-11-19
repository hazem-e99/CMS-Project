import api from './api';

const normalizeId = (value) => {
  const asNumber = Number(value);
  return Number.isNaN(asNumber) ? value : asNumber;
};

/**
 * Fetch sections for a page ordered by `order`.
 * @param {string|number} pageId
 * @returns {Promise<Array<Object>>}
 */
export async function getSectionsByPage(pageId) {
  if (!pageId) return [];
  const response = await api.get('/sections', {
    params: { pageId: normalizeId(pageId), _sort: 'order', _order: 'asc' },
  });
  return response.data;
}

/**
 * Fetch a single section by ID.
 * @param {string|number} id
 * @returns {Promise<Object>}
 */
export async function getSection(id) {
  const response = await api.get(`/sections/${normalizeId(id)}`);
  return response.data;
}

/**
 * Create a section (auto increments order per page).
 * @param {Object} payload
 * @returns {Promise<Object>}
 */
export async function createSection(payload) {
  const pageId = normalizeId(payload.pageId);
  const { data: latestSections } = await api.get('/sections', {
    params: { pageId, _sort: 'order', _order: 'desc', _limit: 1 },
  });

  const nextOrder = payload.order ?? ((latestSections?.[0]?.order || 0) + 1);
  const response = await api.post('/sections', {
    ...payload,
    pageId,
    order: nextOrder,
  });
  return response.data;
}

/**
 * Update a section.
 * @param {string|number} id
 * @param {Object} payload
 * @returns {Promise<Object>}
 */
export async function updateSection(id, payload) {
  const response = await api.patch(`/sections/${normalizeId(id)}`, payload);
  return response.data;
}

/**
 * Delete a section.
 * @param {string|number} id
 * @returns {Promise<void>}
 */
export async function deleteSection(id) {
  await api.delete(`/sections/${normalizeId(id)}`);
}

/**
 * Persist section re-ordering.
 * @param {Array<{id:string|number, order:number}>} updates
 * @returns {Promise<void>}
 */
export async function reorderSections(updates) {
  for (const update of updates) {
    await api.patch(`/sections/${normalizeId(update.id)}`, { order: update.order });
  }
}

export const sectionsService = {
  getSectionsByPage,
  getSection,
  createSection,
  updateSection,
  deleteSection,
  reorderSections,
};

