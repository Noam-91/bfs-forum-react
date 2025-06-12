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
import Login from './pages/auth/Login.tsx';
import Register from './pages/auth/Register.tsx';
import { Navigate } from 'react-router-dom';

import UserManager from './pages/admin/UserManager.tsx';
import EditProfileWrapper from './pages/EditProfileWrapper.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}> 
      <BrowserRouter>
        <AlertProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="admin/users" element={<UserManager />} />
            <Route path={'/contact'} element={<Contact />}/>
            <Route path="/" element={<App />}>
              <Route element={<AuthGuard />}>
                <Route index element={<Navigate to="/login" replace />} />
                {/* <Route index element={<Home />} /> */}
                <Route path="/posts" element={<PanelWrapper />} />
                <Route path="/posts/:postId" element={<PostDetailAdmin />} />

                <Route path="/users/:id/profile" element={<EditProfileWrapper />} />


              </Route>
            </Route>
          </Routes>
        </AlertProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);


