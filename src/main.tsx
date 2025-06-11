import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {AlertProvider} from "./components/alert/AlertHook.tsx";
import PostFormPage from './pages/post/PostFormPage/PostFormPage.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter>
          <AlertProvider>
              <Routes>
                  {/*pages without Nav component*/}
                  <Route path="/*" element={<App />} >
                    <Route path="posts/create" element={<PostFormPage mode="create"/>}/>
                    <Route path="posts/edit/:postId" element={<PostFormPage mode="edit"/>}/>
                  </Route>
              </Routes>
          </AlertProvider>
      </BrowserRouter>
  </StrictMode>,
)
