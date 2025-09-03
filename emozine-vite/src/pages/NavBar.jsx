import { Link, useNavigate } from "react-router-dom"


function NavBar() {
    const navigate = useNavigate();
    const token = localStorage.getItem("access_token");


    const handleLogout = async (e) => {
        e.preventDefault();

        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        navigate('/login');
    }

    return (
        <nav>
            <Link to={"/"}>EMOZINE</Link>
            <Link to={"/create"}>Write</Link>
            <Link to={"/register"}>Register</Link>
            {!token && <Link to={"/login"}>Login</Link>}
            {token && <button onClick={handleLogout}>Logout</button>}
        </nav>
    );
}

export default NavBar;