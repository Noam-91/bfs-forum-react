import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {AlertProvider} from "./components/alert/AlertHook.tsx";
import { Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store.ts';
import PostFormPage from './pages/post/PostFormPage/PostFormPage.tsx';
import AuthGuard from './guards/AuthGuard.tsx';
import UserHomePage from './pages/post/UserHomePage/UserHomePage.tsx';
import PostDetailPage from './pages/post/PostDetailPage/PostDetailPage.tsx';
import Login from './pages/auth/Login.tsx';
import Register from './pages/auth/Register.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
          <AlertProvider>
              <Routes>
                  {/*pages without Nav component*/}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                    {/* <Route path="admin/users" element={<UserManagement />} />
                    <Route path="admin/messages" element={<MessageManager />} /> */}
                  <Route path="/*" element={<App />} >
                    <Route index element={<Navigate to="/login" replace />} />

                    <Route element={<AuthGuard/>}>
                      <Route index element={<UserHomePage/>}/>
                      <Route path="posts/:postId" element={<PostDetailPage />}/>
                      <Route path="posts/new" element={<PostFormPage mode="create"/>}/>
                      <Route path="posts/edit/:postId" element={<PostFormPage mode="edit"/>}/>
                    </Route>
                  </Route>
              </Routes>
          </AlertProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
