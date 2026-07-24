"use client";
import { useEffect, useState } from 'react';

export default function CountdownTimer({ endDate }) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        if (!endDate) return;
        
        const target = new Date(endDate).getTime();
        
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const difference = target - now;

            if (difference < 0) {
                clearInterval(interval);
                setIsExpired(true);
            } else {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((difference % (1000 * 60)) / 1000)
                });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [endDate]);

    if (!endDate || isExpired) return null;

    return (
        <div className="countdown-timer glass-card" style={{ 
            background: 'linear-gradient(135deg, rgba(22, 26, 29, 0.8), rgba(247, 37, 133, 0.05))',
            padding: '20px', 
            borderRadius: '16px', 
            color: 'var(--text-primary)', 
            textAlign: 'center', 
            marginTop: '24px',
            border: '1px solid rgba(247, 37, 133, 0.3)',
            boxShadow: '0 8px 32px rgba(247, 37, 133, 0.15)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle, rgba(247, 37, 133, 0.05) 0%, transparent 60%)', zIndex: 0, pointerEvents: 'none' }}></div>
            <h4 style={{ margin: '0 0 20px 0', fontSize: '1.3rem', color: 'var(--primary-color)', fontWeight: 'bold', position: 'relative', zIndex: 1, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>⏳ الحق احجز قبل انتهاء العرض!</h4>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', fontWeight: 'bold', fontSize: '1.6rem', direction: 'ltr', position: 'relative', zIndex: 1, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--bg-color)', padding: '12px 15px', borderRadius: '12px', minWidth: '75px', boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.8), 0 2px 0 rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{color: 'var(--text-primary)', lineHeight: '1'}}>{timeLeft.days.toString().padStart(2, '0')}</span>
                    <span style={{ fontSize: '0.85rem', opacity: 0.9, color: 'var(--text-secondary)', marginTop: '4px', fontWeight: 'normal' }}>يوم</span>
                </div>
                <span style={{color: 'var(--primary-color)', alignSelf: 'flex-start', marginTop: '12px'}}>:</span>
                <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--bg-color)', padding: '12px 15px', borderRadius: '12px', minWidth: '75px', boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.8), 0 2px 0 rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{color: 'var(--text-primary)', lineHeight: '1'}}>{timeLeft.hours.toString().padStart(2, '0')}</span>
                    <span style={{ fontSize: '0.85rem', opacity: 0.9, color: 'var(--text-secondary)', marginTop: '4px', fontWeight: 'normal' }}>ساعة</span>
                </div>
                <span style={{color: 'var(--primary-color)', alignSelf: 'flex-start', marginTop: '12px'}}>:</span>
                <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--bg-color)', padding: '12px 15px', borderRadius: '12px', minWidth: '75px', boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.8), 0 2px 0 rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{color: 'var(--text-primary)', lineHeight: '1'}}>{timeLeft.minutes.toString().padStart(2, '0')}</span>
                    <span style={{ fontSize: '0.85rem', opacity: 0.9, color: 'var(--text-secondary)', marginTop: '4px', fontWeight: 'normal' }}>دقيقة</span>
                </div>
                <span style={{color: 'var(--primary-color)', alignSelf: 'flex-start', marginTop: '12px'}}>:</span>
                <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--bg-color)', padding: '12px 15px', borderRadius: '12px', minWidth: '75px', boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.8), 0 2px 0 rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{color: 'var(--text-primary)', lineHeight: '1'}}>{timeLeft.seconds.toString().padStart(2, '0')}</span>
                    <span style={{ fontSize: '0.85rem', opacity: 0.9, color: 'var(--text-secondary)', marginTop: '4px', fontWeight: 'normal' }}>ثانية</span>
                </div>
            </div>
        </div>
    );
}
