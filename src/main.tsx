import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {AlertProvider} from "./components/alert/AlertHook.tsx";
import AuthGuard from "./guards/AuthGuard.tsx";
import History from './pages/history/History.tsx';
import UserPosts from './pages/userPosts/userPosts.tsx';
import Login from './pages/auth/Login.tsx';
import Register from './pages/auth/Register.tsx';
import { Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store.ts';
import UserManagement from './pages/admin/UserManagement.tsx';
import MessageManager from './pages/admin/MessageManagement.tsx';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Provider store={store}>
      <BrowserRouter>
          <AlertProvider>
              <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="admin/users" element={<UserManagement />} />
                  <Route path="admin/messages" element={<MessageManager />} />
                  <Route path="/" element={<App />} >
                      <Route path="/history" element={<History />}/>
                      <Route index element={<Navigate to="/login" replace />} />
                      <Route path="/userposts" element={<UserPosts />}/>
                      {/*pages with Nav component*/}
                      <Route element={<AuthGuard/>}>
                          {/*guarded pages*/}
                      </Route>
                      {/*public pages*/}

                  </Route>
              </Routes>
          </AlertProvider>
      </BrowserRouter>
      </Provider>
  </StrictMode>,
)
