import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { HeroUIProvider } from '@heroui/react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import MainLayout from './Layouts/MainLayout'
import AuthLayout from './Layouts/AuthLayout'
import FeedPage from './Pages/FeedPage'
import LoginPage from './Pages/LoginPage'
import NotFoundPage from './Pages/NotFoundPage'
import PostDetails from './Pages/PostDetails'
import ProfilePage from './Pages/ProfilePage'
import ProtectedRoot from './Components/ProtectedRoot'
import AuthProtectedRoot from './Components/AuthProtectedRoot'
import RegisterPage from './Pages/RegisterPage'
import SinglePostPage from './Pages/SinglePostPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <FeedPage/> },
      { path: 'post/:id', element: <PostDetails />},
      { path: 'profile', element: <ProtectedRoot><ProfilePage /></ProtectedRoot> },
      {path: 'single-post/:id' , element:<SinglePostPage/>},
      { path: '*', element: <NotFoundPage /> }
    ]
  },
  {
    path: '/auth',
    element: <AuthProtectedRoot><AuthLayout /></AuthProtectedRoot>,
    children: [
      { path: 'register', element: <RegisterPage /> },
      { path: 'login', element: <LoginPage /> }
    ]
  }
])

function App() {
  return (
    <HeroUIProvider>
      <RouterProvider router={router} />
    </HeroUIProvider>
  )
}

export default App