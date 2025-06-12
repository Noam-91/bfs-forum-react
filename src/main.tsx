import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {AlertProvider} from "./components/alert/AlertHook.tsx";
import PostFormPage from './pages/post/PostFormPage/PostFormPage.tsx';
import PostListPage from './pages/post/PostListPage/PostListPage.tsx';
import AuthGuard from './guards/AuthGuard.tsx';
import AppLayout from './components/layout/post/AppLayout.tsx';
import UserHomePage from './pages/post/UserHomePage/UserHomePage.tsx';
import PostDetailPage from './pages/post/PostDetailPage/PostDetailPage.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter>
          <AlertProvider>
              <Routes>
                  {/*pages without Nav component*/}
                  <Route path="/*" element={<AppLayout />} >
                    <Route index element={<UserHomePage/>}/>
                    <Route index element={<PostDetailPage/>}/>
                    <Route path="posts/new" element={<PostFormPage mode="create"/>}/>
                    <Route path="posts/edit/:postId" element={<PostFormPage mode="edit"/>}/>

                    <Route element={<AuthGuard/>}>
                          {/* route for guard*/}
                          {/* <Route path="admin" element={</>} /> */}
                    </Route>
                  </Route>
              </Routes>
          </AlertProvider>
      </BrowserRouter>
  </StrictMode>,
)
