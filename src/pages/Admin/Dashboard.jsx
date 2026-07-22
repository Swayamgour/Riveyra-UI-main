// components/Dashboard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGetDashboardCountsQuery } from '../../redux/api';



export default function Dashboard() {


    const { data } = useGetDashboardCountsQuery()
    // console.log(data?.data)

    let value = data?.data

    const stats = [
        { label: 'Active Services', value: value?.services, change: '+2', accent: '#60a5fa' },
        { label: 'Portfolio Items', value: value?.projects, change: '+5', accent: '#c084fc' },
        { label: 'Open Positions', value: value?.careers, change: '+1', accent: '#22d3ee' },
        { label: 'Applications', value: value?.applications, change: '+28', accent: '#4ade80' },
    ];


    const navigate = useNavigate();



    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <h1 style={{ fontSize: 28, fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 8 }}>Dashboard</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>Manage your services, portfolio & career openings.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 20, marginBottom: 48 }}>
                {stats.map((s, i) => (
                    <motion.div
                        key={s.label}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: i * 0.08 }}
                        className="glass-card"
                        style={{ padding: '22px 20px' }}
                    >
                        <div style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: 1 }}>{s.label}</div>
                        <div style={{ fontSize: 42, fontWeight: 700, fontFamily: 'var(--font-display)', color: s.accent, margin: '8px 0 4px' }}>{s.value}</div>
                        <div style={{ fontSize: 12, color: '#4ade80' }}>{s.change} from last month</div>
                    </motion.div>
                ))}
            </div>

            <div className="glass-card" style={{ padding: 24 }}>
                <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Quick Actions</h3>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    <button onClick={() => navigate('/admin/services')} className="btn-primary">➕ Add New Service</button>
                    <button onClick={() => navigate('/admin/portfolio/create')} className="btn-primary" style={{ background: 'linear-gradient(135deg,#c084fc,#a855f7)' }}>🎯 Add Projects</button>
                    <button onClick={() => navigate('/admin/careers/create')} className="btn-primary" style={{ background: 'linear-gradient(135deg,#c084fc,#a855f7)' }}> Post a Job</button>
                    <button onClick={() => navigate('/admin/ApplyCandidates')} className="btn-primary" style={{ background: 'linear-gradient(135deg,#c084fc,#a855f7)' }}>🎯 Apply Candidate</button>
                    {/* <button onClick={() => navigate('/admin/careers')} className="btn-secondary">📢</button> */}
                </div>
            </div>
        </motion.div>
    );
}