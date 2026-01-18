import config from '../config';

function Home() {
    return (
        <>
            <div className="hero">
                <div className="hero-content">
                    <h1>{config.tagline}</h1>
                    <p>{config.description}</p>
                    <div className="hero-actions">
                        <a href={config.links.downloadApp} className="cta-button primary">Download App</a>
                        <a href="#features" className="cta-button secondary">Learn More</a>
                    </div>
                </div>
            </div>

            <section id="features" className="features-section">
                <h2 className="section-title">Why Choose Aurora?</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="icon">📺</div>
                        <h3>Multi-Platform</h3>
                        <p>Stream simultaneously to YouTube, Facebook, Twitch, and custom RTMP destinations without breaking a sweat.</p>
                    </div>
                    <div className="feature-card">
                        <div className="icon">🎙️</div>
                        <h3>Pro Audio</h3>
                        <p>Full control over your sound. Mix internal audio, microphone, and apply noise suppression for crisp vocals.</p>
                    </div>
                    <div className="feature-card">
                        <div className="icon">🎨</div>
                        <h3>Custom Overlays</h3>
                        <p>Make your stream stand out with realtime graphics, lower-thirds, and professional watermarks.</p>
                    </div>
                    <div className="feature-card">
                        <div className="icon">🚄</div>
                        <h3>Low Latency</h3>
                        <p>Optimized for speed. Engage with your audience in real-time with our ultra-low latency streaming protocol support.</p>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Home;
