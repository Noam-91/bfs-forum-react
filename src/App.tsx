import './App.css'
import Nav from "./components/nav/Nav.tsx";
import {Outlet} from 'react-router-dom';

function App() {

  return (
    <>
      <Nav />
      <Outlet />
    </>
  );
}

export default App;
