"use client";

import { useRef } from 'react';

export default function RichTextEditor({ value, onChange }) {
    const editorRef = useRef(null);

    const execCmd = (cmd, arg, e) => {
        e.preventDefault();
        document.execCommand(cmd, false, arg);
        onChange(editorRef.current.innerHTML);
    };

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    return (
        <div style={{ border: '1px solid var(--glass-border)', borderRadius: '12px', overflow: 'hidden', background: 'rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', gap: '5px', padding: '10px', borderBottom: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', flexWrap: 'wrap' }}>
                <button type="button" onClick={(e) => execCmd('bold', null, e)} className="btn" style={{ padding: '6px 12px', fontWeight: 'bold' }}>B</button>
                <button type="button" onClick={(e) => execCmd('italic', null, e)} className="btn" style={{ padding: '6px 12px', fontStyle: 'italic' }}>I</button>
                <button type="button" onClick={(e) => execCmd('underline', null, e)} className="btn" style={{ padding: '6px 12px', textDecoration: 'underline' }}>U</button>
                <div style={{ width: '1px', background: 'var(--glass-border)', margin: '0 5px' }}></div>
                <button type="button" onClick={(e) => execCmd('insertUnorderedList', null, e)} className="btn" style={{ padding: '6px 12px' }}>• List</button>
                <button type="button" onClick={(e) => execCmd('insertOrderedList', null, e)} className="btn" style={{ padding: '6px 12px' }}>1. List</button>
                <div style={{ width: '1px', background: 'var(--glass-border)', margin: '0 5px' }}></div>
                <button type="button" onClick={(e) => {
                    const url = prompt('Enter link URL:');
                    if (url) execCmd('createLink', url, e);
                }} className="btn" style={{ padding: '6px 12px' }}>🔗 Link</button>
                <button type="button" onClick={(e) => execCmd('unlink', null, e)} className="btn" style={{ padding: '6px 12px' }}>❌ Unlink</button>
                <div style={{ width: '1px', background: 'var(--glass-border)', margin: '0 5px' }}></div>
                <button type="button" onClick={(e) => execCmd('formatBlock', 'H2', e)} className="btn" style={{ padding: '6px 12px' }}>H2</button>
                <button type="button" onClick={(e) => execCmd('formatBlock', 'H3', e)} className="btn" style={{ padding: '6px 12px' }}>H3</button>
                <button type="button" onClick={(e) => execCmd('formatBlock', 'P', e)} className="btn" style={{ padding: '6px 12px' }}>P</button>
            </div>
            <div 
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                onBlur={handleInput}
                dangerouslySetInnerHTML={{ __html: value }}
                style={{
                    padding: '20px',
                    minHeight: '200px',
                    outline: 'none',
                    direction: 'rtl',
                    textAlign: 'right',
                    color: '#fff',
                    lineHeight: '1.6'
                }}
            />
            <textarea 
                value={value} 
                onChange={(e) => onChange(e.target.value)}
                style={{ width: '100%', height: '100px', padding: '10px', background: 'rgba(0,0,0,0.4)', color: 'var(--text-secondary)', border: 'none', borderTop: '1px solid var(--glass-border)', fontFamily: 'monospace', direction: 'ltr', textAlign: 'left', display: 'none' }} 
            />
        </div>
    );
}
