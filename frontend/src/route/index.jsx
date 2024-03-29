import * as React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

//pages
import CreateMeeting from '../pages/CreateMeeting';
import Meeting from '../pages/Meeting';

const router = createBrowserRouter([
  {
    path: '/',
    element: <CreateMeeting />
  },
  {
    path: 'meeting',
    element: <Meeting />
  }
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
