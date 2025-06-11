import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {AlertProvider} from "./components/alert/AlertHook.tsx";
import AuthGuard from "./guards/AuthGuard.tsx";
import Login from './pages/auth/Login.tsx';
import Register from './pages/auth/Register.tsx';
import { Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store.ts';
import UserManager from './pages/admin/UserManager.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <AlertProvider>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="admin/users" element={<UserManager />} />
                        <Route path="/" element={<App />}>
                            <Route index element={<Navigate to="/login" replace />} />
                            <Route element={<AuthGuard />}>
                                {/* 受保护页面 */}

                            </Route>
                        </Route>
                    </Routes>
                </AlertProvider>
            </BrowserRouter>
        </Provider>
    </StrictMode>,
)