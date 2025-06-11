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
import Contact from "./pages/contact/Contact.tsx";
// import EditProfile from './pages/EditProfile.tsx';
// import EditProfileWrapper from './pages/EditProfileWrapper.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}> 
      <BrowserRouter>
        <AlertProvider>
          <Routes>
            <Route path={'/contact'} element={<Contact />}/>
            <Route path="/" element={<App />}>
              <Route element={<AuthGuard />}>
                <Route index element={<PanelWrapper />} />
                <Route path="/post/:postId" element={<PostDetailAdmin />} />

                {/* <Route path="/users/:id/profile" element={<EditProfileWrapper />} /> */}


              </Route>
            </Route>
          </Routes>
        </AlertProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);


