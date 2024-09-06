import React from "react";
import RootLayout from "./components/RootLayout";
import Home from "./Pages/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AllContextProvider from "./context/AllContext";

const router = createBrowserRouter([
  {
    path: "/",
    id: "root",
    element: <RootLayout />,
    children: [{ index: true, element: <Home /> }],
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
