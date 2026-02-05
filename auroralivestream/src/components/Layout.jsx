import { Outlet, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Layout() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="app-wrapper">
            <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
                <div className="container nav-content">
                    <Link to="/" className="logo">
                        <span className="text-aurora">AURORA</span> <span>LIVE</span>
                    </Link>
                    <div className="nav-links">
                        <Link to="/">Home</Link>
                        <Link to="/privacy">Privacy</Link>
                        <Link to="/terms">Terms</Link>
                        <a href="/api/admin/auth/google" className="btn-glass" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>Login</a>
                    </div>
                </div>
            </nav>

            <main>
                <Outlet />
            </main>

            <footer>
                <div className="container">
                    <div className="footer-grid">
                        <div className="footer-brand">
                            <h3 className="text-gradient">Aurora Live</h3>
                            <p>The next generation of high-performance streaming technology. built for creators who demand perfection.</p>
                        </div>
                        <div className="footer-col">
                            <h4>Legal</h4>
                            <ul>
                                <li><Link to="/privacy">Privacy Policy</Link></li>
                                <li><Link to="/terms">Terms of Service</Link></li>
                                <li><Link to="/delete-account">Delete Account</Link></li>
                            </ul>
                        </div>
                        <div className="footer-col">
                            <h4>Contact</h4>
                            <ul>
                                <li><a href="mailto:support@auroralive.com">Support</a></li>
                                <li><a href="#">Twitter/X</a></li>
                                <li><a href="#">Discord</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; {new Date().getFullYear()} Aurora Live Streaming. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Layout;
