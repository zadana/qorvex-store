"use client";
import { useState, useEffect } from 'react';

export default function MenuBuilder({ onChange, initialValue = '[]' }) {
    const [menus, setMenus] = useState([]);

    useEffect(() => {
        try {
            setMenus(JSON.parse(initialValue || '[]'));
        } catch {
            setMenus([]);
        }
    }, [initialValue]);

    const handleChange = (newMenus) => {
        setMenus(newMenus);
        onChange(JSON.stringify(newMenus));
    };

    const addMenu = () => {
        handleChange([...menus, { title: '', url: '' }]);
    };

    const removeMenu = (index) => {
        const newMenus = menus.filter((_, i) => i !== index);
        handleChange(newMenus);
    };

    const updateMenu = (index, field, value) => {
        const newMenus = [...menus];
        newMenus[index][field] = value;
        handleChange(newMenus);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {menus.map((menu, index) => (
                <div key={index} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input 
                        type="text" 
                        placeholder="اسم الرابط (مثال: الرئيسية)" 
                        value={menu.title} 
                        onChange={(e) => updateMenu(index, 'title', e.target.value)}
                        className="form-input" 
                        style={{ flex: 1 }}
                    />
                    <input 
                        type="text" 
                        placeholder="الرابط (مثال: /products)" 
                        value={menu.url} 
                        onChange={(e) => updateMenu(index, 'url', e.target.value)}
                        className="form-input" 
                        style={{ flex: 2, direction: 'ltr', textAlign: 'left' }}
                    />
                    <button 
                        type="button" 
                        onClick={() => removeMenu(index)}
                        className="btn" 
                        style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '8px 12px' }}
                    >
                        ❌
                    </button>
                </div>
            ))}
            <button 
                type="button" 
                onClick={addMenu}
                className="btn btn-outline" 
                style={{ alignSelf: 'flex-start', padding: '8px 16px', marginTop: '10px' }}
            >
                ➕ إضافة رابط جديد
            </button>
        </div>
    );
}
