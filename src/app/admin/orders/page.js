"use client";

import { useEffect, useState } from 'react';

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedOrder, setExpandedOrder] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders');
            if (res.ok) {
                const data = await res.json();
                setOrders(Array.isArray(data) ? data : []);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrders(); }, []);

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                showToast('تم تحديث حالة الطلب بنجاح ✅');
                fetchOrders();
            } else {
                showToast('حدث خطأ أثناء التحديث', 'error');
            }
        } catch (e) {
            showToast('تعذر الاتصال بالخادم', 'error');
        }
    };

    const deleteOrder = async (orderId) => {
        if (!confirm('هل أنت متأكد من حذف هذا الطلب نهائياً؟ لا يمكن التراجع عن هذا الإجراء.')) return;
        try {
            const res = await fetch(`/api/orders/${orderId}`, { method: 'DELETE' });
            if (res.ok) {
                showToast('تم حذف الطلب بنجاح');
                fetchOrders();
            } else {
                showToast('حدث خطأ أثناء الحذف', 'error');
            }
        } catch (e) {
            showToast('تعذر الاتصال بالخادم', 'error');
        }
    };

    const getStatusBadge = (status) => {
        const map = {
            pending: { label: 'قيد الانتظار', class: 'badge-pending', icon: '⏳' },
            processing: { label: 'جاري التجهيز', class: 'badge-processing', icon: '🔄' },
            shipped: { label: 'تم الشحن', class: 'badge-shipped', icon: '🚚' },
            delivered: { label: 'تم التوصيل', class: 'badge-delivered', icon: '✅' },
            cancelled: { label: 'ملغي', class: 'badge-cancelled', icon: '❌' },
        };
        const info = map[status] || { label: status, class: 'badge-pending', icon: '📋' };
        return <span className={`badge ${info.class}`}>{info.icon} {info.label}</span>;
    };

    const getCustomer = (order) => {
        if (!order.customerData) return null;
        try { return JSON.parse(order.customerData); } catch { return null; }
    };

    const filteredOrders = orders.filter(order => {
        if (filter !== 'all' && order.status !== filter) return false;
        if (searchTerm) {
            const customer = getCustomer(order);
            const searchLower = searchTerm.toLowerCase();
            const matchId = order.id.toLowerCase().includes(searchLower);
            const matchName = customer?.name?.toLowerCase().includes(searchLower);
            const matchPhone = customer?.phone?.includes(searchTerm);
            return matchId || matchName || matchPhone;
        }
        return true;
    });

    const statusCounts = {
        all: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        processing: orders.filter(o => o.status === 'processing').length,
        shipped: orders.filter(o => o.status === 'shipped').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length,
    };

    const totalRevenue = filteredOrders.filter(o => o.status !== 'cancelled').reduce((a, o) => a + o.totalAmount, 0);

    if (loading) {
        return (
            <div className="animate-fade-in">
                <h1 className="text-gradient" style={{ marginBottom: '30px' }}>🛒 إدارة الطلبات</h1>
                {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: '120px', borderRadius: '16px', marginBottom: '16px' }}></div>)}
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            {toast && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 className="text-gradient" style={{ margin: 0 }}>🛒 إدارة الطلبات</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>إجمالي {filteredOrders.length} طلب — قيمة {totalRevenue.toFixed(0)} ر.س</p>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <input
                        type="text" placeholder="🔍 بحث بالرقم أو الاسم أو الهاتف..."
                        value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                        className="form-input" style={{ width: '280px', padding: '10px 16px' }}
                    />
                </div>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
                {[
                    { key: 'all', label: 'الكل', color: 'var(--text-primary)' },
                    { key: 'pending', label: 'معلق', color: 'var(--warning-color)' },
                    { key: 'processing', label: 'قيد التجهيز', color: '#60a5fa' },
                    { key: 'shipped', label: 'تم الشحن', color: '#a78bfa' },
                    { key: 'delivered', label: 'تم التوصيل', color: 'var(--success-color)' },
                    { key: 'cancelled', label: 'ملغي', color: 'var(--danger-color)' },
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setFilter(tab.key)}
                        style={{
                            padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.9rem', fontWeight: '600',
                            background: filter === tab.key ? `${tab.color}20` : 'var(--surface-color)',
                            color: filter === tab.key ? tab.color : 'var(--text-secondary)',
                            border: `1px solid ${filter === tab.key ? `${tab.color}50` : 'var(--glass-border)'}`,
                            transition: 'var(--transition)',
                        }}
                    >
                        {tab.label} ({statusCounts[tab.key]})
                    </button>
                ))}
            </div>

            {/* Orders List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredOrders.length === 0 ? (
                    <div className="glass-card" style={{ textAlign: 'center', padding: '60px' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📭</div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>لا توجد طلبات مطابقة للبحث</p>
                    </div>
                ) : filteredOrders.map(order => {
                    const customer = getCustomer(order);
                    const isExpanded = expandedOrder === order.id;
                    return (
                        <div key={order.id} className="glass-card" style={{ padding: '20px' }}>
                            {/* Order Header */}
                            <div
                                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', flexWrap: 'wrap', gap: '12px' }}
                                onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                            >
                                <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flex: 1, minWidth: '300px' }}>
                                    <div style={{
                                        width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: order.status === 'pending' ? 'rgba(245,158,11,0.15)' :
                                            order.status === 'delivered' ? 'rgba(16,185,129,0.15)' :
                                                order.status === 'cancelled' ? 'rgba(239,68,68,0.15)' : 'rgba(59,130,246,0.15)',
                                        fontSize: '1.2rem'
                                    }}>
                                        {order.paymentMethod === 'card' ? '💳' : '💵'}
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                            <h4 style={{ margin: 0, fontSize: '1.05rem' }}>#{order.id.slice(-6).toUpperCase()}</h4>
                                            {getStatusBadge(order.status)}
                                        </div>
                                        <div style={{ display: 'flex', gap: '16px', marginTop: '4px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                            <span>📅 {new Date(order.createdAt).toLocaleString('ar-SA')}</span>
                                            {customer && <span>👤 {customer.name}</span>}
                                            <span>📦 {order.items?.length || 0} منتج</span>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    <div style={{ textAlign: 'left' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary-color)' }}>{order.totalAmount} ر.س</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                            {order.paymentMethod === 'card' ? '💳 بطاقة' : '💵 عند الاستلام'}
                                        </div>
                                    </div>
                                    <span style={{ fontSize: '1.2rem', transition: 'transform 0.3s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                                </div>
                            </div>

                            {/* Expanded Details */}
                            {isExpanded && (
                                <div className="animate-fade-in" style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--glass-border)' }}>
                                    <div className="grid grid-cols-2" style={{ gap: '20px' }}>
                                        {/* Products */}
                                        <div>
                                            <h4 style={{ marginBottom: '12px', fontSize: '0.95rem' }}>📦 المنتجات المطلوبة</h4>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                {order.items?.map(item => (
                                                    <div key={item.id} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '10px', background: 'var(--surface-color)', borderRadius: '10px' }}>
                                                        {item.product?.image && (
                                                            <img src={item.product.image} alt="" style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }}
                                                                onError={e => e.target.style.display = 'none'} />
                                                        )}
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{item.product?.title || 'منتج محذوف'}</div>
                                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>الكمية: {item.quantity} × {item.price} ر.س</div>
                                                        </div>
                                                        <div style={{ fontWeight: '700', color: 'var(--primary-color)' }}>{(item.price * item.quantity).toFixed(0)} ر.س</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Customer Info + Actions */}
                                        <div>
                                            {customer && (
                                                <div style={{ marginBottom: '16px' }}>
                                                    <h4 style={{ marginBottom: '12px', fontSize: '0.95rem' }}>👤 بيانات العميل</h4>
                                                    <div style={{ padding: '16px', background: 'var(--surface-color)', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                        <div style={{ display: 'flex', gap: '8px' }}><strong style={{ minWidth: '60px' }}>الاسم:</strong> {customer.name}</div>
                                                        <div style={{ display: 'flex', gap: '8px' }}><strong style={{ minWidth: '60px' }}>الهاتف:</strong> <a href={`tel:${customer.phone}`} style={{ color: 'var(--accent-color)' }}>{customer.phone}</a></div>
                                                        <div style={{ display: 'flex', gap: '8px' }}><strong style={{ minWidth: '60px' }}>العنوان:</strong> {customer.address}</div>
                                                    </div>
                                                </div>
                                            )}

                                            <h4 style={{ marginBottom: '12px', fontSize: '0.95rem' }}>⚙️ تحديث الحالة</h4>
                                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
                                                    <button
                                                        key={status}
                                                        onClick={(e) => { e.stopPropagation(); updateOrderStatus(order.id, status); }}
                                                        disabled={order.status === status}
                                                        style={{
                                                            padding: '8px 14px', borderRadius: '8px', cursor: order.status === status ? 'default' : 'pointer',
                                                            fontFamily: 'inherit', fontSize: '0.8rem', fontWeight: '600',
                                                            opacity: order.status === status ? 0.4 : 1,
                                                            background: order.status === status ? 'var(--surface-color)' : 'transparent',
                                                            border: '1px solid var(--glass-border)', color: 'var(--text-primary)',
                                                            transition: 'var(--transition)',
                                                        }}
                                                    >
                                                        {getStatusBadge(status).props.children}
                                                    </button>
                                                ))}
                                            </div>

                                            <button
                                                onClick={(e) => { e.stopPropagation(); deleteOrder(order.id); }}
                                                style={{
                                                    marginTop: '16px', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
                                                    fontFamily: 'inherit', fontSize: '0.85rem', fontWeight: '600',
                                                    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                                                    color: '#f87171', width: '100%',
                                                }}
                                            >
                                                🗑️ حذف الطلب نهائياً
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
