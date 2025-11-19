import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { NavBar } from '../components/public/NavBar';
import { Footer } from '../components/public/Footer';
import { PageRenderer } from '../components/public/PageRenderer';
import { SurveyPage } from '../components/public/SurveyPage';
import { LoginPage } from '../pages/LoginPage';
import { AdminLayout } from '../components/admin/AdminLayout';
import { PageList } from '../components/admin/PageList';
import { PageEditor } from '../components/admin/PageEditor';
import { SurveyList } from '../components/admin/SurveyList';
import { SurveyEditor } from '../components/admin/SurveyEditor';
import { SurveyResponses } from '../components/admin/SurveyResponses';
import { ProtectedRoute } from './ProtectedRoute';

/**
 * Application Routes
 */
export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          <PublicLayout>
            <Navigate to="/page/home" replace />
          </PublicLayout>
        }
      />
      
      <Route
        path="/page/:slug"
        element={
          <PublicLayout>
            <PageRenderer />
          </PublicLayout>
        }
      />

      <Route
        path="/survey/:slug"
        element={
          <PublicLayout>
            <SurveyPage />
          </PublicLayout>
        }
      />

      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Navigate to="/admin/pages" replace />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/pages"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <PageList />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/pages/:id"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <PageEditor />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/surveys"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <SurveyList />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/surveys/:id"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <SurveyEditor />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/surveys/:id/responses"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <SurveyResponses />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route
        path="*"
        element={
          <PublicLayout>
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
                <a href="/" className="text-blue-600 hover:underline">Go Home</a>
              </div>
            </div>
          </PublicLayout>
        }
      />
    </Routes>
  );
};

// Public Layout Wrapper
const PublicLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

