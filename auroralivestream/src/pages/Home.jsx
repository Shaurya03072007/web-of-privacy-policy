import config from '../config';

function Home() {
    return (
        <>
            <section className="hero">
                <div className="container hero-content">
                    <h1>
                        Stream Beyond <br />
                        <span className="text-aurora">Boundaries</span>
                    </h1>
                    <p>{config.description}</p>
                    <div className="hero-buttons">
                        <a href={config.links.downloadApp} className="btn btn-primary">Download App</a>
                        <a href="/api/admin/auth/google" className="btn btn-glass">Creator Dashboard</a>
                    </div>
                </div>
            </section>

            <section className="features container">
                <div className="section-header">
                    <h2>Why Creators Choose <span className="text-gradient">Aurora</span></h2>
                </div>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">⚡</div>
                        <h3>Ultra Low Latency</h3>
                        <p>Engage with your audience in real-time. Our SRT protocol ensures your stream arrives in milliseconds, not seconds.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">💎</div>
                        <h3>4K HDR Quality</h3>
                        <p>Don't compromise on pixels. Stream in crystal clear 2160p resolution with support for high dynamic range colors.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">📡</div>
                        <h3>Multi-Streaming</h3>
                        <p>One signal, infinite destinations. Broadcast to YouTube, Twitch, and Facebook simultaneously without extra bandwidth.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">🎛️</div>
                        <h3>Pro Audio Mixing</h3>
                        <p>Complete control over your soundscape. Mix internal audio, microphone, and apply noise suppression on the fly.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">🎨</div>
                        <h3>Dynamic Overlays</h3>
                        <p>Stand out with professional lower-thirds, watermarks, and real-time graphics rendered directly on your device.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">🔒</div>
                        <h3>Secure & Private</h3>
                        <p>Your content belongs to you. We use enterprise-grade encryption to ensure your stream is safe from prying eyes.</p>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Home;
