'use client';

export default function Error({ error, reset }) {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            direction: 'rtl',
            background: 'var(--bg-primary, #0a0a0f)',
            color: 'var(--text-primary, #fff)',
            fontFamily: 'inherit',
            padding: '20px'
        }}>
            <div style={{
                textAlign: 'center',
                maxWidth: '500px',
                background: 'var(--glass-bg, rgba(255,255,255,0.05))',
                border: '1px solid var(--glass-border, rgba(255,255,255,0.1))',
                borderRadius: '24px',
                padding: '60px 40px',
                backdropFilter: 'blur(20px)'
            }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>⚠️</div>
                <h2 style={{
                    fontSize: '1.8rem',
                    marginBottom: '16px',
                    background: 'linear-gradient(135deg, #f72585, #7209b7)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    حدث خطأ غير متوقع
                </h2>
                <p style={{
                    color: 'var(--text-secondary, #999)',
                    fontSize: '1.1rem',
                    marginBottom: '30px',
                    lineHeight: 1.8
                }}>
                    نعتذر عن هذا الخطأ. يرجى المحاولة مرة أخرى أو العودة للصفحة الرئيسية.
                </p>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
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
                            cursor: 'pointer',
                            transition: 'transform 0.2s, opacity 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.opacity = '0.9'}
                        onMouseOut={(e) => e.target.style.opacity = '1'}
                    >
                        🔄 إعادة المحاولة
                    </button>
                    <a
                        href="/"
                        style={{
                            padding: '14px 32px',
                            borderRadius: '12px',
                            border: '1px solid var(--glass-border, rgba(255,255,255,0.2))',
                            background: 'transparent',
                            color: 'var(--text-primary, #fff)',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            textDecoration: 'none',
                            transition: 'background 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
                        onMouseOut={(e) => e.target.style.background = 'transparent'}
                    >
                        🏠 الصفحة الرئيسية
                    </a>
                </div>
            </div>
        </div>
    );
}
