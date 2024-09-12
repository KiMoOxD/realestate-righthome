import React from "react";
import RootLayout from "./components/RootLayout";
import Home from "./Pages/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AllContextProvider from "./context/AllContext";
import BrowsePage from "./Pages/BrowsePage";
import AddApartmentForm from './Pages/TestPage'
import PropertyPage from "./Pages/PropertyPage";
import { loader } from "./Pages/PropertyPage";
import AdminPage from './Pages/AdminPage'
const router = createBrowserRouter([
  {
    path: "/",
    id: "root",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "browse", element: <BrowsePage />},
      { path: '/browse/:collection', element: <PropertyPage />, loader: loader},
      { path: '/browse/:collection/:id', element: <PropertyPage />, loader: loader},
      { path: "/admin", element: <AdminPage /> },
      { path: "test", element: <AddApartmentForm /> },
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
