import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {AlertProvider} from "./components/alert/AlertHook.tsx";
import AuthGuard from "./guards/AuthGuard.tsx";
import PanelWrapper from './pages/PanelWrapper.tsx';
import { Provider } from 'react-redux'; // <-- ADD THIS
import store from './redux/store'; // <-- YOUR STORE
import PostDetailAdmin from './pages/PostDetailAdmin.tsx'; 

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}> {/* ✅ Wrap your entire app here */}
      <BrowserRouter>
        <AlertProvider>
          <Routes>
            <Route path="/" element={<App />}>
              <Route element={<AuthGuard />}>
                <Route index element={<PanelWrapper />} />
                <Route path="/post/:postId" element={<PostDetailAdmin />} />

              </Route>
            </Route>
          </Routes>
        </AlertProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
