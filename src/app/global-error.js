'use client';

export default function GlobalError({ error, reset }) {
    return (
        <html lang="ar" dir="rtl">
            <body style={{
                margin: 0,
                padding: 0,
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#0a0a0f',
                color: '#fff',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}>
                <div style={{
                    textAlign: 'center',
                    maxWidth: '500px',
                    padding: '60px 40px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '24px',
                    backdropFilter: 'blur(20px)'
                }}>
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔧</div>
                    <h2 style={{
                        fontSize: '1.8rem',
                        marginBottom: '16px',
                        background: 'linear-gradient(135deg, #f72585, #7209b7)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        حدث خطأ في تحميل الصفحة
                    </h2>
                    <p style={{
                        color: '#999',
                        fontSize: '1.1rem',
                        marginBottom: '30px',
                        lineHeight: 1.8
                    }}>
                        نعتذر عن هذا الخلل. يرجى إعادة تحميل الصفحة.
                    </p>
                    <button
                        onClick={() => reset()}
                        style={{
                            padding: '14px 32px',
                            borderRadius: '12px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #f72585, #7209b7)',
                            color: '#fff',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        🔄 إعادة تحميل الصفحة
                    </button>
                </div>
            </body>
        </html>
    );
}
