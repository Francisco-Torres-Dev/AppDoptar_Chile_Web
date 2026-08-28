import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ToastContainer } from '../components/common/ToastContainer';
import { ErrorBoundary } from '../components/common/ErrorBoundary';

export function MainLayout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
}
