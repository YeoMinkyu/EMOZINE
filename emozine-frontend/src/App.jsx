import './App.css';
import {BrowserRouter, Routes, Route, Link} from "react-router-dom";
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to={"/"}>Home</Link>
        <Link to={"/login"}>Login</Link>
      </nav>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
