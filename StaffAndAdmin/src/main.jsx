import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import {Toaster}  from "sonner"
import { RouterProvider } from 'react-router-dom'
import AppRouter from './routers/index.jsx'
import Store from './store/store'
import { Provider } from 'react-redux'
 
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={Store}>
    <Toaster richColors/>
    <RouterProvider router={AppRouter} /> 
    </Provider>
  </StrictMode>,
)
