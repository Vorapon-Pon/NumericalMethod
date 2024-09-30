import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './components/Home.jsx';
import TopicPage from './components/TopicPage.jsx';
import SolutionPage from './components/SolutionPage.jsx'; 

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/:topicId',
    element: <TopicPage />,
  },
  {
    path: '/:topicId/:methodId',
    element: <SolutionPage />,
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
