import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {Toaster}  from "sonner"
import { RouterProvider } from 'react-router-dom'
import AppRouter from './routers/index.jsx'

 
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Toaster richColors/>
    <RouterProvider router={AppRouter} /> 
  </StrictMode>,
)
