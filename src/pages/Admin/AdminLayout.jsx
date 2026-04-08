// components/AdminLayout.jsx
import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

const Icons = {
    Dashboard: () => <span>📊</span>,
    Services: () => <span>⚙️</span>,
    Portfolio: () => <span>🎨</span>,
    Career: () => <span>💼</span>,
    ArrowRight: () => <span>→</span>,
    Code: () => <span>💻</span>,
    Mobile: () => <span>📱</span>,
    Marketing: () => <span>📈</span>,
    Settings: () => <span>⚙️</span>,
};

export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const navItems = [
        { path: '/admin/dashboard', label: 'Dashboard', icon: <Icons.Dashboard /> },
        { path: '/admin/services', label: 'Services', icon: <Icons.Services /> },
        { path: '/admin/portfolio', label: 'Portfolio', icon: <Icons.Portfolio /> },
        { path: '/admin/careers', label: 'Careers', icon: <Icons.Career /> },
        { path: '/admin/ApplyCandidates', label: 'Applications', icon: <Icons.Career /> },

    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
            {/* Sidebar */}
            <motion.aside
                initial={{ x: -260 }}
                animate={{ x: sidebarOpen ? 0 : -260 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                style={{
                    width: 260,
                    background: 'rgba(10,15,31,0.95)',
                    backdropFilter: 'blur(16px)',
                    borderRight: '1px solid var(--border-subtle)',
                    position: 'fixed',
                    height: '100vh',
                    zIndex: 50,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--border-subtle)', marginBottom: 20 }}>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, background: 'linear-gradient(135deg,#60a5fa,#c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Riveyra<span style={{ color: '#60a5fa', background: 'none', WebkitTextFillColor: 'initial' }}>|Admin</span>
                    </h2>
                    <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>Control Panel</p>
                </div>
                <nav style={{ flex: 1, padding: '0 12px' }}>
                    {navItems.map(item => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                padding: '12px 16px',
                                borderRadius: 12,
                                marginBottom: 6,
                                textDecoration: 'none',
                                color: isActive ? 'white' : 'var(--text-muted)',
                                background: isActive ? 'rgba(96,165,250,0.12)' : 'transparent',
                                border: isActive ? '1px solid rgba(96,165,250,0.25)' : '1px solid transparent',
                                transition: 'all 0.2s',
                            })}
                        >
                            <span style={{ fontSize: 18 }}>{item.icon}</span>
                            <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500 }}>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
                <div style={{ padding: 20, borderTop: '1px solid var(--border-subtle)', fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>
                    v2.0 · Secure Panel
                </div>
            </motion.aside>

            {/* Main content */}
            <div style={{ flex: 1, marginLeft: sidebarOpen ? 260 : 0, transition: 'margin 0.3s' }}>
                <header style={{
                    padding: '16px 28px',
                    background: 'rgba(2,8,18,0.8)',
                    backdropFilter: 'blur(12px)',
                    borderBottom: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'sticky',
                    top: 0,
                    zIndex: 40,
                }}>
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="btn-secondary" style={{ padding: '8px 12px', cursor: 'pointer' }}>
                        ☰
                    </button>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80', animation: 'pulse 2s infinite' }} />
                        <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)' }}>Admin · Online</span>
                    </div>
                </header>
                <main style={{ padding: '28px 32px' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}