import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "./pages/login/LoginPage";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./components/PrivateRoute";
import History from "./pages/History";
import Report from "./pages/Report";
import PaymentSuccess from "./pages/PaymentSuccess";
import Payment from "./pages/Payment";
import AuthCallback from "./components/AuthCallback";
import storageService from "./services/storageService";
import MenuPage from "./pages/menu/MenuPage";

const getToken = storageService.getJwtToken();
const isAuthernticated = getToken ? true : false;

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
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
        element: <PaymentSuccess />
      }
    ]
  },
  {
    path: '/auth-callback',
    element: <AuthCallback />
    // element: <PrivateRoute isAuth={isAuthernticated} />,
    // children: [
    //   {
    //     path: "",
    //     element: <AuthCallback />
    //   }
    // ]
  },
  {
    path: '/history',
    element: <PrivateRoute isAuth={isAuthernticated} />,
    children: [
      {
        path: "",
        element: <History />
      }
    ]
  },
  {
    path: '/report',
    element: <PrivateRoute isAuth={isAuthernticated} />,
    children: [
      {
        path: "",
        element: <Report />
      }
    ]
  },
  {
    path: '/payment/:id',
    element: <PrivateRoute isAuth={isAuthernticated} />,
    children: [
      {
        path: "",
        element: <Payment id={0} />
      }
    ]
  },
  {
    path: '/',
    element: <Navigate to="/menu" replace />
  },
  {
    path: '*',
    element: <NotFound />
  }
]);

export default router;
