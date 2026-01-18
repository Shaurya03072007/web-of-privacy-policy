import { Outlet, Link, useLocation } from 'react-router-dom';
import config from '../config';

function Layout() {
    const location = useLocation();

    // Helper to determine active link style (optional visual cue)
    const isActive = (path) => location.pathname === path ? { color: 'var(--primary-color)' } : {};

    return (
        <>
            <header>
                <Link to="/" className="logo">
                    <img src="/logo.png" alt="Logo" className="logo-img" />
                    <span>{config.companyName}</span>
                </Link>
                <nav>
                    <ul>
                        <li><Link to="/" style={isActive('/')}>Home</Link></li>
                        <li><Link to="/privacy" style={isActive('/privacy')}>Privacy</Link></li>
                        <li><Link to="/terms" style={isActive('/terms')}>Terms</Link></li>
                    </ul>
                </nav>
            </header>

            <main>
                <Outlet />
            </main>

            <footer>
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>{config.companyName}</h3>
                        <p>{config.contact.address}</p>
                        <p><a href={`mailto:${config.contact.email}`}>{config.contact.email}</a></p>
                    </div>

                    <div className="footer-links">
                        <Link to="/">Home</Link>
                        <Link to="/privacy">Privacy Policy</Link>
                        <Link to="/terms">Terms & Conditions</Link>
                        <Link to="/delete-account">Delete Account</Link>
                    </div>
                </div>
                <p className="copyright">&copy; {new Date().getFullYear()} {config.companyName}. All rights reserved.</p>
            </footer>
        </>
    );
}

export default Layout;
