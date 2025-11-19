import { createServer, Model, Factory, Response } from 'miragejs';
import { seedData } from './seedData';

/**
 * MirageJS Mock API Server
 * Simulates backend API endpoints for development
 * Replace with real backend endpoints in production
 */
export function makeServer({ environment = 'development' } = {}) {
  return createServer({
    environment,

    models: {
      page: Model,
      section: Model,
      survey: Model,
      surveyResponse: Model,
      user: Model,
    },

    seeds(server) {
      // Seed initial data
      seedData.users.forEach(user => server.create('user', user));
      seedData.pages.forEach(page => server.create('page', page));
      seedData.sections.forEach(section => server.create('section', section));
      seedData.surveys.forEach(survey => server.create('survey', survey));
    },

    routes() {
      this.namespace = 'api';
      this.timing = 400; // Simulate network delay

      // Auth endpoints
      this.post('/login', (schema, request) => {
        const { email, password } = JSON.parse(request.requestBody);
        const user = schema.users.findBy({ email });
        
        if (user && user.password === password) {
          return {
            token: 'mock-jwt-token-' + Date.now(),
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
            },
          };
        }
        
        return new Response(401, {}, { error: 'Invalid credentials' });
      });

      this.post('/logout', () => {
        return { success: true };
      });

      // Pages endpoints
      this.get('/pages', (schema) => {
        return schema.pages.all();
      });

      this.get('/pages/:id', (schema, request) => {
        const page = schema.pages.find(request.params.id);
        if (!page) {
          return new Response(404, {}, { error: 'Page not found' });
        }
        
        // Get sections for this page
        const sections = schema.sections
          .where({ pageId: page.id })
          .sort((a, b) => a.order - b.order);
        
        return {
          ...page.attrs,
          sectionsData: sections.models.map(s => s.attrs),
        };
      });

      this.post('/pages', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        const maxOrder = schema.pages.all().models.reduce((max, p) => 
          Math.max(max, p.order || 0), 0);
        
        return schema.pages.create({
          ...attrs,
          order: attrs.order !== undefined ? attrs.order : maxOrder + 1,
        });
      });

      this.put('/pages/:id', (schema, request) => {
        const id = request.params.id;
        const attrs = JSON.parse(request.requestBody);
        const page = schema.pages.find(id);
        
        if (!page) {
          return new Response(404, {}, { error: 'Page not found' });
        }
        
        return page.update(attrs);
      });

      this.delete('/pages/:id', (schema, request) => {
        const page = schema.pages.find(request.params.id);
        if (!page) {
          return new Response(404, {}, { error: 'Page not found' });
        }
        
        // Delete associated sections
        schema.sections.where({ pageId: page.id }).destroy();
        page.destroy();
        
        return { success: true };
      });

      // Sections endpoints
      this.get('/sections', (schema, request) => {
        const pageId = request.queryParams.pageId;
        if (pageId) {
          return schema.sections
            .where({ pageId })
            .sort((a, b) => a.order - b.order);
        }
        return schema.sections.all();
      });

      this.get('/sections/:id', (schema, request) => {
        const section = schema.sections.find(request.params.id);
        if (!section) {
          return new Response(404, {}, { error: 'Section not found' });
        }
        return section;
      });

      this.post('/sections', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        const maxOrder = schema.sections
          .where({ pageId: attrs.pageId })
          .models.reduce((max, s) => Math.max(max, s.order || 0), 0);
        
        return schema.sections.create({
          ...attrs,
          order: attrs.order !== undefined ? attrs.order : maxOrder + 1,
        });
      });

      this.put('/sections/:id', (schema, request) => {
        const id = request.params.id;
        const attrs = JSON.parse(request.requestBody);
        const section = schema.sections.find(id);
        
        if (!section) {
          return new Response(404, {}, { error: 'Section not found' });
        }
        
        return section.update(attrs);
      });

      this.delete('/sections/:id', (schema, request) => {
        const section = schema.sections.find(request.params.id);
        if (!section) {
          return new Response(404, {}, { error: 'Section not found' });
        }
        
        section.destroy();
        return { success: true };
      });

      // Batch update sections order
      this.post('/sections/reorder', (schema, request) => {
        const { sections } = JSON.parse(request.requestBody);
        
        sections.forEach(({ id, order }) => {
          const section = schema.sections.find(id);
          if (section) {
            section.update({ order });
          }
        });
        
        return { success: true };
      });

      // Surveys endpoints
      this.get('/surveys', (schema) => {
        return schema.surveys.all();
      });

      this.get('/surveys/:id', (schema, request) => {
        const survey = schema.surveys.find(request.params.id);
        if (!survey) {
          return new Response(404, {}, { error: 'Survey not found' });
        }
        return survey;
      });

      this.post('/surveys', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        return schema.surveys.create(attrs);
      });

      this.put('/surveys/:id', (schema, request) => {
        const id = request.params.id;
        const attrs = JSON.parse(request.requestBody);
        const survey = schema.surveys.find(id);
        
        if (!survey) {
          return new Response(404, {}, { error: 'Survey not found' });
        }
        
        return survey.update(attrs);
      });

      this.delete('/surveys/:id', (schema, request) => {
        const survey = schema.surveys.find(request.params.id);
        if (!survey) {
          return new Response(404, {}, { error: 'Survey not found' });
        }
        
        // Delete associated responses
        schema.surveyResponses.where({ surveyId: survey.id }).destroy();
        survey.destroy();
        
        return { success: true };
      });

      // Survey responses endpoints
      this.get('/surveys/:id/responses', (schema, request) => {
        return schema.surveyResponses.where({ 
          surveyId: request.params.id 
        });
      });

      this.post('/surveys/:id/responses', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        return schema.surveyResponses.create({
          ...attrs,
          surveyId: request.params.id,
          submittedAt: new Date().toISOString(),
        });
      });

      // Export data endpoint (for data portability)
      this.get('/export', (schema) => {
        return {
          pages: schema.pages.all().models.map(p => p.attrs),
          sections: schema.sections.all().models.map(s => s.attrs),
          surveys: schema.surveys.all().models.map(s => s.attrs),
        };
      });

      // Import data endpoint
      this.post('/import', (schema, request) => {
        const { pages, sections, surveys } = JSON.parse(request.requestBody);
        
        // Clear existing data
        schema.db.pages.remove();
        schema.db.sections.remove();
        schema.db.surveys.remove();
        
        // Import new data
        pages.forEach(page => schema.create('page', page));
        sections.forEach(section => schema.create('section', section));
        surveys.forEach(survey => schema.create('survey', survey));
        
        return { success: true };
      });
    },
  });
}

