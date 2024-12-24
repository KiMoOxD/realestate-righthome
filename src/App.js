import React from "react";
import RootLayout from "./components/RootLayout";
import Home from "./Pages/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AllContextProvider from "./context/AllContext";
import BrowsePage from "./Pages/BrowsePage";
import PropertyPage from "./Pages/PropertyPage";
import { loader } from "./Pages/PropertyPage";
// import AdminPage from './Pages/AdminPage'
import ErrorPage from "./components/ErrorPage";
const LazyAdmin = React.lazy(() => import('./Pages/AdminPage'))

const router = createBrowserRouter([
  {
    path: "/",
    id: "root",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "browse", element: <BrowsePage />},
      { path: '/browse/:collection', element: <PropertyPage />, loader: loader},
      { path: '/browse/:collection/:id', element: <PropertyPage />, loader: loader},
      { path: "/admin", element: <React.Suspense fallback="Loading..."><LazyAdmin /></React.Suspense> },
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
