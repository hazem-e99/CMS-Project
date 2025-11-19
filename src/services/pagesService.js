import api from './api';

const normalizeId = (value) => {
  const asNumber = Number(value);
  return Number.isNaN(asNumber) ? value : asNumber;
};

/**
 * Fetch all pages ordered by the `order` field.
 * @returns {Promise<Array<Object>>}
 */
export async function getPages() {
  const response = await api.get('/pages', {
    params: { _sort: 'order', _order: 'asc' },
  });
  return response.data;
}

/**
 * Fetch a single page by ID.
 * @param {string|number} id
 * @returns {Promise<Object>}
 */
export async function getPage(id) {
  const response = await api.get(`/pages/${normalizeId(id)}`);
  return response.data;
}

/**
 * Create a new page (auto-assigns next order if missing).
 * @param {Object} payload
 * @returns {Promise<Object>}
 */
export async function createPage(payload) {
  const { data: latestPages } = await api.get('/pages', {
    params: { _sort: 'order', _order: 'desc', _limit: 1 },
  });

  const nextOrder = payload.order ?? ((latestPages?.[0]?.order || 0) + 1);
  const response = await api.post('/pages', {
    ...payload,
    order: nextOrder,
  });
  return response.data;
}

/**
 * Update an existing page.
 * @param {string|number} id
 * @param {Object} payload
 * @returns {Promise<Object>}
 */
export async function updatePage(id, payload) {
  const response = await api.patch(`/pages/${normalizeId(id)}`, payload);
  return response.data;
}

/**
 * Delete a page and cascade delete its sections.
 * @param {string|number} id
 * @returns {Promise<void>}
 */
export async function deletePage(id) {
  const pageId = normalizeId(id);
  const { data: relatedSections } = await api.get('/sections', {
    params: { pageId },
  });

  for (const section of relatedSections) {
    await api.delete(`/sections/${section.id}`);
  }

  await api.delete(`/pages/${pageId}`);
}

export const pagesService = {
  getPages,
  getPage,
  createPage,
  updatePage,
  deletePage,
};

