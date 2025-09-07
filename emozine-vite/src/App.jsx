import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import Dashboard from './pages/Dashboard.jsx';
import CreateEntry from './pages/CreateEntry.jsx';
import EntryList from './pages/EntryList.jsx';
import NavBar from './pages/NavBar.jsx';
import Register from './pages/Register.jsx';
import EditEntry from './pages/EditEntry.jsx';

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard /> } />
        <Route path='/create' element={<CreateEntry />} />
        <Route path='/entries' element={<EntryList />} />
        <Route path='/entries/:id/edit' element={<EditEntry />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
