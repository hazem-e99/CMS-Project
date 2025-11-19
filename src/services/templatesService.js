import api from './api';

const normalizeId = (value) => {
  const asNumber = Number(value);
  return Number.isNaN(asNumber) ? value : asNumber;
};

/**
 * Fetch all templates.
 * @returns {Promise<Array<Object>>}
 */
export async function getTemplates() {
  const response = await api.get('/templates');
  return response.data;
}

/**
 * Fetch a single template.
 * @param {string|number} id
 * @returns {Promise<Object>}
 */
export async function getTemplate(id) {
  const response = await api.get(`/templates/${normalizeId(id)}`);
  return response.data;
}

/**
 * Create a template.
 * @param {Object} payload
 * @returns {Promise<Object>}
 */
export async function createTemplate(payload) {
  const response = await api.post('/templates', payload);
  return response.data;
}

/**
 * Update a template.
 * @param {string|number} id
 * @param {Object} payload
 * @returns {Promise<Object>}
 */
export async function updateTemplate(id, payload) {
  const response = await api.put(`/templates/${normalizeId(id)}`, payload);
  return response.data;
}

/**
 * Delete a template.
 * @param {string|number} id
 * @returns {Promise<void>}
 */
export async function deleteTemplate(id) {
  await api.delete(`/templates/${normalizeId(id)}`);
}

export const templatesService = {
  getTemplates,
  getTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
};

