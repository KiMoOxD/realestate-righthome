import React from "react";
import RootLayout from "./components/RootLayout";
import Home from "./Pages/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AllContextProvider from "./context/AllContext";
import BrowsePage from './Pages/BrowsePage'

const router = createBrowserRouter([
  {
    path: "/",
    id: "root",
    element: <RootLayout />,
    children: [{ index: true, element: <Home /> }, {path: 'browse', element: <BrowsePage />}],
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
