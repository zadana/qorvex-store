"use client";

import { useEffect, useState } from 'react';

export default function AdminCustomers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedUser, setExpandedUser] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/customers');
            if (res.ok) {
                const data = await res.json();
                setUsers(Array.isArray(data) ? data : []);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const deleteUser = async (id) => {
        if (!confirm('هل أنت متأكد من حذف هذا العميل وجميع طلباته؟ لا يمكن التراجع.')) return;
        try {
            const res = await fetch(`/api/admin/customers/${id}`, { method: 'DELETE' });
            if (res.ok) {
                showToast('تم حذف العميل بنجاح');
                fetchUsers();
            } else {
                showToast('حدث خطأ أثناء الحذف', 'error');
            }
        } catch (e) {
            showToast('تعذر الاتصال بالخادم', 'error');
        }
    };

    const toggleRole = async (user) => {
        const newRole = user.role === 'admin' ? 'user' : 'admin';
        try {
            const res = await fetch(`/api/admin/customers/${user.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...user, role: newRole })
            });
            if (res.ok) {
                showToast(`تم تغيير صلاحية ${user.name} إلى ${newRole === 'admin' ? 'مدير' : 'عميل'}`);
                fetchUsers();
            }
        } catch (e) {
            showToast('حدث خطأ', 'error');
        }
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalSpent = (user) => {
        return user.orders?.filter(o => o.status !== 'cancelled').reduce((a, o) => a + o.totalAmount, 0) || 0;
    };

    if (loading) {
        return (
            <div className="animate-fade-in">
                <h1 className="text-gradient" style={{ marginBottom: '30px' }}>👥 إدارة العملاء</h1>
                {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: '80px', borderRadius: '16px', marginBottom: '16px' }}></div>)}
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            {toast && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 className="text-gradient" style={{ margin: 0 }}>👥 إدارة العملاء</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>إجمالي {users.length} مستخدم مسجل</p>
                </div>
                <input
                    type="text" placeholder="🔍 بحث بالاسم أو البريد..."
                    value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                    className="form-input" style={{ width: '280px', padding: '10px 16px' }}
                />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3" style={{ marginBottom: '24px' }}>
                <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(76,201,240,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>👥</div>
                    <div>
                        <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--accent-color)' }}>{users.filter(u => u.role !== 'admin').length}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>عملاء</div>
                    </div>
                </div>
                <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(247,37,133,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>👑</div>
                    <div>
                        <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary-color)' }}>{users.filter(u => u.role === 'admin').length}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>مدراء</div>
                    </div>
                </div>
                <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>💰</div>
                    <div>
                        <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--success-color)' }}>{users.reduce((a, u) => a + totalSpent(u), 0).toFixed(0)}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>إجمالي الإنفاق (ر.س)</div>
                    </div>
                </div>
            </div>

            {/* Users List */}
            <div className="glass-card">
                <table className="data-table" style={{ width: '100%' }}>
                    <thead>
                        <tr>
                            <th>العميل</th>
                            <th>البريد الإلكتروني</th>
                            <th>الطلبات</th>
                            <th>إجمالي الإنفاق</th>
                            <th>الصلاحية</th>
                            <th>تاريخ التسجيل</th>
                            <th>إجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                                    {searchTerm ? 'لا توجد نتائج مطابقة' : 'لا يوجد عملاء مسجلين حتى الآن'}
                                </td>
                            </tr>
                        ) : filteredUsers.map(user => (
                            <tr key={user.id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{
                                            width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            background: user.role === 'admin' ? 'rgba(247,37,133,0.15)' : 'rgba(76,201,240,0.15)',
                                            fontSize: '1rem',
                                        }}>{user.role === 'admin' ? '👑' : '👤'}</div>
                                        <span style={{ fontWeight: '600' }}>{user.name}</span>
                                    </div>
                                </td>
                                <td style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{user.email}</td>
                                <td>
                                    <span style={{ fontWeight: '600' }}>{user.orders?.length || 0}</span>
                                </td>
                                <td style={{ fontWeight: '600', color: 'var(--primary-color)' }}>{totalSpent(user).toFixed(0)} ر.س</td>
                                <td>
                                    <button onClick={() => toggleRole(user)} style={{
                                        padding: '5px 12px', borderRadius: '8px', cursor: 'pointer', border: 'none', fontFamily: 'inherit', fontSize: '0.8rem', fontWeight: '600',
                                        background: user.role === 'admin' ? 'rgba(247,37,133,0.15)' : 'rgba(76,201,240,0.1)',
                                        color: user.role === 'admin' ? 'var(--primary-color)' : 'var(--accent-color)',
                                    }}>
                                        {user.role === 'admin' ? '👑 مدير' : '👤 عميل'}
                                    </button>
                                </td>
                                <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                    {new Date(user.createdAt).toLocaleDateString('ar-SA')}
                                </td>
                                <td>
                                    <button onClick={() => deleteUser(user.id)}
                                        style={{ padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.1)', color: '#f87171', fontFamily: 'inherit', fontSize: '0.8rem' }}>
                                        🗑️ حذف
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
