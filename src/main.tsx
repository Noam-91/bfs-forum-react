import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {AlertProvider} from "./components/alert/AlertHook.tsx";
import AuthGuard from "./guards/AuthGuard.tsx";
import PanelWrapper from './pages/adminPanel/PanelWrapper.tsx'
import { Provider } from 'react-redux'; // <-- ADD THIS
import store from './redux/store'; // <-- YOUR STORE
import PostDetailAdmin from './pages/adminPostDetail/PostDetailAdmin.tsx'; 
import Contact from "./pages/contact/Contact.tsx";
import EditProfile from './pages/editProfile/EditProfile.tsx';
import Login from './pages/auth/Login.tsx';
import Register from './pages/auth/Register.tsx';
import UserManager from './pages/admin/UserManager.tsx';
import UserProfile from './pages/profile/UserProfile.tsx';
import Home from './pages/home/Home.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}> 
      <BrowserRouter>
        <AlertProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/" element={<App />}>
              <Route element={<AuthGuard />}>
                <Route index element={<Home />}/>
                <Route path="admin/users" element={<UserManager />} />
                
                <Route path="/posts" element={<PanelWrapper />} />
                <Route path="/posts/:postId" element={<PostDetailAdmin />} />

                <Route path="/edit-profile/:id" element={<EditProfile />} />

                <Route path="/users/:userId/profile" element={<UserProfile />} />


              </Route>
            </Route>
          </Routes>
        </AlertProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);


