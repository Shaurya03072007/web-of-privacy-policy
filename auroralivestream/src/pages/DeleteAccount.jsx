function DeleteAccount() {
    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Deletion request submitted. We will contact you shortly.');
    };

    return (
        <>
            <div className="hero">
                <h1>Delete Account</h1>
                <p>We're sorry to see you go. If you wish to delete your account, please follow the instructions below.</p>
            </div>

            <section
                style={{
                    background: 'var(--card-bg)',
                    padding: '2rem',
                    borderRadius: '8px',
                    marginTop: '2rem',
                    maxWidth: '800px',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                }}>
                <h2 style={{ color: 'white', marginBottom: '1.5rem' }}>How to delete your account</h2>

                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>Option 1: In-App Deletion</h3>
                    <ol style={{ color: 'var(--text-color)', marginLeft: '1.5rem', lineHeight: '1.6' }}>
                        <li>Open the <strong>Aurora LIVE Streaming</strong> app on your device.</li>
                        <li>Navigate to <strong>Settings</strong> from the main menu.</li>
                        <li>Tap on <strong>Account</strong>.</li>
                        <li>Scroll down and select <strong>Delete Account</strong>.</li>
                        <li>Confirm your choice when prompted.</li>
                    </ol>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
                    <h3 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>Option 2: Request Deletion</h3>
                    <p style={{ color: 'var(--text-color)', marginBottom: '1.5rem' }}>If you cannot access the app, you can
                        request account deletion here. We will process your request within 30 days.</p>

                    <form
                        onSubmit={handleSubmit}
                        style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
                        <div>
                            <label htmlFor="email" style={{ display: 'block', color: 'white', marginBottom: '0.5rem' }}>Email
                                Address</label>
                            <input type="email" id="email" required placeholder="Enter your registered email"
                                style={{
                                    width: '100%',
                                    padding: '0.8rem',
                                    borderRadius: '4px',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    background: 'rgba(0,0,0,0.2)',
                                    color: 'white'
                                }} />
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <input type="checkbox" id="confirm" required />
                            <label htmlFor="confirm" style={{ color: 'var(--text-color)', marginLeft: '0.5rem' }}>I understand that
                                this action is permanent and cannot be undone.</label>
                        </div>

                        <button type="submit" className="cta-button"
                            style={{ border: 'none', cursor: 'pointer', background: '#ff4444' }}>Delete My Account</button>
                    </form>
                </div>
            </section>
        </>
    );
}

export default DeleteAccount;
