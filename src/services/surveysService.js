import api from './api';

const normalizeId = (value) => {
  const asNumber = Number(value);
  return Number.isNaN(asNumber) ? value : asNumber;
};

/**
 * Fetch all surveys sorted by creation date.
 * @returns {Promise<Array<Object>>}
 */
export async function getSurveys() {
  const response = await api.get('/surveys', {
    params: { _sort: 'createdAt', _order: 'desc' },
  });
  return response.data;
}

/**
 * Fetch a survey by ID.
 * @param {string|number} id
 * @returns {Promise<Object>}
 */
export async function getSurvey(id) {
  const response = await api.get(`/surveys/${normalizeId(id)}`);
  return response.data;
}

/**
 * Create a new survey.
 * @param {Object} payload
 * @returns {Promise<Object>}
 */
export async function createSurvey(payload) {
  const response = await api.post('/surveys', {
    ...payload,
    createdAt: payload.createdAt || new Date().toISOString(),
  });
  return response.data;
}

/**
 * Update a survey.
 * @param {string|number} id
 * @param {Object} payload
 * @returns {Promise<Object>}
 */
export async function updateSurvey(id, payload) {
  const response = await api.patch(`/surveys/${normalizeId(id)}`, payload);
  return response.data;
}

/**
 * Delete a survey and its responses.
 * @param {string|number} id
 * @returns {Promise<void>}
 */
export async function deleteSurvey(id) {
  const surveyId = normalizeId(id);
  const { data: responses } = await api.get('/surveyResponses', {
    params: { surveyId },
  });

  for (const responseItem of responses) {
    await api.delete(`/surveyResponses/${responseItem.id}`);
  }

  await api.delete(`/surveys/${surveyId}`);
}

/**
 * Fetch survey responses.
 * @param {string|number} surveyId
 * @returns {Promise<Array<Object>>}
 */
export async function getResponses(surveyId) {
  const response = await api.get('/surveyResponses', {
    params: { surveyId: normalizeId(surveyId), _sort: 'submittedAt', _order: 'desc' },
  });
  return response.data;
}

/**
 * Submit a new survey response.
 * @param {string|number} surveyId
 * @param {{answers:Array}} payload
 * @returns {Promise<Object>}
 */
export async function submitResponse(surveyId, payload) {
  const response = await api.post('/surveyResponses', {
    ...payload,
    surveyId: normalizeId(surveyId),
    submittedAt: new Date().toISOString(),
  });
  return response.data;
}

export const surveysService = {
  getSurveys,
  getSurvey,
  createSurvey,
  updateSurvey,
  deleteSurvey,
  getResponses,
  submitResponse,
};

