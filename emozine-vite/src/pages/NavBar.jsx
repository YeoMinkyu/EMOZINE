import { useState } from "react";
import { Link, useNavigate, useLocation, matchPath } from "react-router-dom"
import { ROUTE } from "../config/urls";

function NavBar() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem("access_token");


    const handleLogout = async (e) => {
        e.preventDefault();
        setLoading(true);

        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setLoading(false);
        navigate('/login');
    }

    return (
        <div className="w-full px-4 py-2">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <nav
                    className="flex flex-col md:flex-row md:items-center gap-2"
                >
                    <NavItem 
                            route={token ? ROUTE.DASHBOARD : ROUTE.HOME}
                            label={"EMOZINE"}
                            location={location}
                            className={"font-bold text-2xl px-2 py-1 rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-700"}
                    />
                    <CurrentPageLabel pagename={location.pathname} />
                </nav>
                <nav className="flex flex-col md:flex-row md:items-center gap-2">
                    {!token &&
                        <NavItem 
                            route={ROUTE.REGISTER}
                            location={location}
                            className={"navbar"}
                        />
                    }
                    {!token &&
                        <NavItem 
                            route={ROUTE.LOGIN}
                            location={location}
                            className={"navbar"}
                        />
                    }
                    {token &&
                        <button
                            className="navbar w-fit"
                            disabled={loading}
                            onClick={handleLogout}
                            aria-label="Log out of your account"
                            aria-busy={loading}
                        >
                            {loading ? "Logout..." :"Logout"}
                        </button>
                    }
                    {token &&
                        <NavItem 
                            route={ROUTE.CREATE}
                            location={location}
                            className={"button-primary w-fit"}
                        />
                    }
                </nav>
            </div>
        </div>
    );
}

function createCurrentPageLabel(pathname) {
    for (const key in ROUTE) {
        const { path, label } = ROUTE[key];
        if (matchPath({path:path, end:true}, pathname)) {
            return label;
        }
    }
    return "";
}

function CurrentPageLabel({ pagename }) {
    const label = createCurrentPageLabel(pagename);

    return (
        <>
            <span className="text-gray-300">{`>`}</span>
            <span className="navbar w-fit" aria-current="page">{label}</span>
        </>
    );
}

function NavItem({ 
        route,
        label="",
        location,
        className 
    }) {

    const isCurrent = !!matchPath({path: route.path, end: true}, location.pathname);

    return (
        <Link
            to={route.path}
            className={className}
            aria-current={isCurrent ? 'page' : undefined}
        >
            {label || route.label}
        </Link>
    );
}

export default NavBar;