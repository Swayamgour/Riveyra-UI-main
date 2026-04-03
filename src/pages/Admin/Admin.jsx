// components/AdminPanel.jsx
import React, { useState } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Dashboard from './Dashboard';
import ServicesManager from './ServicesManager';
import PortfolioManager from './PortfolioManager';
import CareerManager from './CareerManager';
// import Icons from './ui/Icons';

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

export default function AdminPanel() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();

    const navItems = [
        { path: '/admin/dashboard', label: 'Dashboard', icon: <Icons.Dashboard /> },
        { path: '/admin/services', label: 'Services', icon: <Icons.Services /> },
        { path: '/admin/portfolio', label: 'Portfolio', icon: <Icons.Portfolio /> },
        { path: '/admin/careers', label: 'Careers', icon: <Icons.Career /> },
    ];

    return (
        <div style={{ flex: 1,  transition: 'margin 0.3s' }}>

            <main style={{ padding: '28px 32px' }}>
                <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="services" element={<ServicesManager />} />
                    <Route path="portfolio" element={<PortfolioManager />} />
                    <Route path="careers" element={<CareerManager />} />
                    <Route path="*" element={<Dashboard />} />
                </Routes>
            </main>
        </div>
    );
}