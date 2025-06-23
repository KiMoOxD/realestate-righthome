import React from "react";
import RootLayout from "./components/RootLayout";
import Home from "./Pages/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AllContextProvider from "./context/AllContext";
import { loader } from "./Pages/PropertyPage";
import ErrorPage from "./components/ErrorPage";
import LoadingScreen from "./components/LoadingScreen";

const LazyAdmin = React.lazy(() => import('./Pages/AdminPage'))
const LazyPropertyPage = React.lazy(() => import('./Pages/PropertyPage'))
const LazyBrowsePage = React.lazy(() => import('./Pages/BrowsePage'))


const router = createBrowserRouter([
  {
    path: "/",
    id: "root",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { 
        path: "browse", 
        element: (
          <React.Suspense fallback={<LoadingScreen />}>
            <LazyBrowsePage />
          </React.Suspense>
        )
      },
      { 
        path: '/browse/:collection/:id', 
        element: (
          <React.Suspense fallback={<LoadingScreen />}>
            <LazyPropertyPage />
          </React.Suspense>
        ), 
        loader: loader
      },
      { 
        path: "/admin", 
        element: (
          <React.Suspense fallback={<LoadingScreen />}>
            <LazyAdmin />
          </React.Suspense>
        ) 
      },
    ],
  },
]);

const App = () => {
  return (
    <AllContextProvider>
      <RouterProvider router={router} />
    </AllContextProvider>
  );
};

export default App;