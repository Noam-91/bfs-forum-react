import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {AlertProvider} from "./components/alert/AlertHook.tsx";
import AuthGuard from "./guards/AuthGuard.tsx";
import Contact from "./pages/contact/Contact.tsx";
import store from "./redux/store.ts";
import {Provider} from "react-redux";
import Home from "./pages/home/Home.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Provider store={store}>
          <BrowserRouter>
              <AlertProvider>
                  <Routes>
                      {/*pages without Nav component*/}
                      <Route path={'/contact'} element={<Contact />}/>
                      <Route path="/" element={<App />}>
                          {/*pages with Nav component*/}
                          <Route element={<AuthGuard/>}>
                              {/*guarded pages*/}
                              <Route index element={<Home />} />
                          </Route>
                          {/*public pages*/}

                      </Route>
                  </Routes>
              </AlertProvider>
          </BrowserRouter>
    </Provider>
  </StrictMode>,
)
