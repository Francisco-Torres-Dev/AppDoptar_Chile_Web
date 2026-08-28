import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { MainLayout } from './layouts/MainLayout';
import { ProtectedRoute, GuestRoute } from './routes/ProtectedRoute';
import { ErrorBoundary } from './components/common/ErrorBoundary';

import HomePage from './pages/HomePage';
import AdoptionsPage from './pages/adoption/AdoptionsPage';
import PetDetailPage from './pages/adoption/PetDetailPage';
import PublishPetPage from './pages/adoption/PublishPetPage';
import MatchPage from './pages/adoption/MatchPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import Verify2FAPage from './pages/auth/Verify2FAPage';
import CrowdfundingPage from './pages/crowdfunding/CrowdfundingPage';
import CreateCampaignPage from './pages/crowdfunding/CreateCampaignPage';
import CampaignDetailPage from './pages/crowdfunding/CampaignDetailPage';
import DonationsPage from './pages/donations/DonationsPage';
import MapPage from './pages/MapPage';
import CreateReportPage from './pages/CreateReportPage';
import FoundationsPage from './pages/FoundationsPage';
import FoundationDetailPage from './pages/FoundationDetailPage';
import UserDashboardPage from './pages/UserDashboardPage';
import NotificationsPage from './pages/NotificationsPage';
import FavoritesPage from './pages/FavoritesPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';
import ForbiddenPage from './pages/ForbiddenPage';
import ProfilePage from './pages/ProfilePage';
import FoundationDashboardPage from './pages/FoundationDashboardPage';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <Routes>
              <Route element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="adopciones" element={<AdoptionsPage />} />
                <Route path="mascotas/:id" element={<PetDetailPage />} />
                <Route path="match" element={<MatchPage />} />
                <Route path="crowdfunding" element={<CrowdfundingPage />} />
                <Route path="crowdfunding/:id" element={<CampaignDetailPage />} />
                <Route path="donaciones" element={<DonationsPage />} />
                <Route path="mapa" element={<MapPage />} />
                <Route path="fundaciones" element={<FoundationsPage />} />
                <Route path="fundaciones/:id" element={<FoundationDetailPage />} />
                <Route path="403" element={<ForbiddenPage />} />
                <Route path="verify-2fa" element={<Verify2FAPage />} />

                <Route element={<GuestRoute />}>
                  <Route path="login" element={<LoginPage />} />
                  <Route path="registro" element={<RegisterPage />} />
                  <Route path="forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="reset-password" element={<ResetPasswordPage />} />
                  <Route path="reset-password/:token" element={<ResetPasswordPage />} />
                </Route>

                <Route element={<ProtectedRoute />}>
                  <Route path="publicar-mascota" element={<PublishPetPage />} />
                  <Route path="crear-campana" element={<CreateCampaignPage />} />
                  <Route path="crowdfunding/crear" element={<CreateCampaignPage />} />
                  <Route path="reportar" element={<CreateReportPage />} />
                  <Route path="dashboard" element={<UserDashboardPage />} />
                  <Route path="perfil" element={<ProfilePage />} />
                  <Route path="notificaciones" element={<NotificationsPage />} />
                  <Route path="favoritos" element={<FavoritesPage />} />
                </Route>

                <Route element={<ProtectedRoute roles={['FOUNDATION', 'RESCUER', 'ADMIN']} />}>
                  <Route path="fundacion/dashboard" element={<FoundationDashboardPage />} />
                </Route>

                <Route element={<ProtectedRoute roles={['ADMIN', 'MODERATOR']} />}>
                  <Route path="admin" element={<AdminPage />} />
                </Route>

                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
