import './App.css';
import {BrowserRouter, Routes, Route, Link} from "react-router-dom";
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import Dashboard from './pages/Dashboard.jsx';
import CreateEntry from './pages/CreateEntry.jsx';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to={"/"}>Home</Link>
        <Link to={"/create"}>Write</Link>
        <Link to={"/login"}>Login</Link>
      </nav>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard /> } />
        <Route path='/create' element={<CreateEntry />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
