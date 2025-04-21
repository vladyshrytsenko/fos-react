import { createBrowserRouter, Navigate } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import AuthCallback from "./components/AuthCallback";
import storageService from "./services/storageService";
import MenuPage from "./pages/MenuPage";
import PaymentPage from "./pages/PaymentPage";
import NotFoundPage from "./pages/NotFoundPage";
import ReportPage from "./pages/ReportPage";
import HistoryPage from "./pages/HistoryPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import LoginPage from "./pages/LoginPage";

const getToken = storageService.getJwtToken();
const isAuthernticated = getToken ? true : false;

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/menu',
    element: <PrivateRoute isAuth={isAuthernticated} />,
    children: [
      {
        path: "",
        element: <MenuPage />
      }
    ]
  },
  {
    path: '/payment-success',
    element: <PrivateRoute isAuth={isAuthernticated} />,
    children: [
      {
        path: "",
        element: <PaymentSuccessPage />
      }
    ]
  },
  {
    path: '/auth-callback',
    element: <AuthCallback />
  },
  {
    path: '/history',
    element: <PrivateRoute isAuth={isAuthernticated} />,
    children: [
      {
        path: "",
        element: <HistoryPage />
      }
    ]
  },
  {
    path: '/report',
    element: <PrivateRoute isAuth={isAuthernticated} />,
    children: [
      {
        path: "",
        element: <ReportPage />
      }
    ]
  },
  {
    path: '/payment/:id',
    element: <PrivateRoute isAuth={isAuthernticated} />,
    children: [
      {
        path: "",
        element: <PaymentPage />
      }
    ]
  },
  {
    path: '/',
    element: <Navigate to="/menu" replace />
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
]);

export default router;
