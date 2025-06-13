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
import UserProfile from './pages/profile/UserProfile.tsx';
import Home from './pages/home/Home.tsx';
import UserManagement from "./pages/admin/UserManagement.tsx";
import MessageManagement from "./pages/admin/MessageManagement.tsx";
import PostDetailPage from "./pages/post/PostDetailPage/PostDetailPage.tsx";
import UserHomePage from "./pages/post/UserHomePage/UserHomePage.tsx";
import PostFormPage from "./pages/post/PostFormPage/PostFormPage.tsx";
import UserPosts from "./pages/user-posts/userPosts.tsx";

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
                <Route index element={<UserHomePage />}/>
                <Route path={"posts/new"} element={<PostFormPage/>}/>
                <Route path="admin/users" element={<UserManagement />} />
                <Route path="admin/messages" element={<MessageManagement />} />
                <Route path="/user/posts" element={<UserPosts />} />

                <Route path="/posts" element={<PanelWrapper />} />
                <Route path="/posts/:postId" element={<PostDetailAdmin />} />
                <Route path={"post/:postId"} element={<PostDetailPage/>} />

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


