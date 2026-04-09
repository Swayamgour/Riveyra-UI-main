// AdminContactQueries.jsx
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGetContactQuery } from '../../redux/api'

const AdminContactQueries = () => {
    const { data, isSuccess } = useGetContactQuery()
    const [queries, setQueries] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedQuery, setSelectedQuery] = useState(null)
    const [filter, setFilter] = useState('all') // all, pending, contacted, resolved
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedServices, setSelectedServices] = useState([])
    const [selectedBudget, setSelectedBudget] = useState('')

    // Mock data - replace with your API call
    useEffect(() => {
        // Simulate API call
        if (isSuccess) {

            setQueries(data?.data)
            setLoading(false)


        }
    }, [isSuccess, data])



    const filteredQueries = queries.filter(query => {
        if (filter !== 'all' && query.status !== filter) return false
        if (searchTerm && !query.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !query.email.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !query.company.toLowerCase().includes(searchTerm.toLowerCase())) return false
        if (selectedServices.length > 0 && !selectedServices.some(s => query.services.includes(s))) return false
        if (selectedBudget && query.budget !== selectedBudget) return false
        return true
    })

    const stats = {
        total: queries.length,
        pending: queries.filter(q => q.status === 'pending').length,
        contacted: queries.filter(q => q.status === 'contacted').length,
        resolved: queries.filter(q => q.status === 'resolved').length
    }

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                background: '#0a0f1e'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: 40,
                        height: 40,
                        border: '3px solid rgba(96,165,250,0.2)',
                        borderTopColor: '#60a5fa',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite',
                        margin: '0 auto 16px'
                    }} />
                    <p style={{ color: 'rgba(255,255,255,0.6)' }}>Loading queries...</p>
                </div>
            </div>
        )
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0a0f1e 0%, #0c1222 100%)',
            padding: '24px'
        }}>
            <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

            {/* Header */}
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto 32px'
            }}>
                <h1 style={{
                    fontSize: '32px',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #60a5fa 0%, #c084fc 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '8px'
                }}>
                    Contact Queries Dashboard
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.5)' }}>
                    Manage and track all customer inquiries
                </p>
            </div>

            {/* Stats Cards */}
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto 32px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px'
            }}>
                {[
                    { label: 'Total Queries', value: stats.total, color: '#60a5fa' },
                    { label: 'Pending', value: stats.pending, color: '#f59e0b' },
                    { label: 'Contacted', value: stats.contacted, color: '#3b82f6' },
                    { label: 'Resolved', value: stats.resolved, color: '#10b981' }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '16px',
                            padding: '20px',
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>{stat.label}</div>
                        <div style={{ fontSize: '36px', fontWeight: 700, color: stat.color }}>{stat.value}</div>
                    </motion.div>
                ))}
            </div>

            {/* Filters */}
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto 24px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px',
                padding: '20px'
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px',
                    marginBottom: '16px'
                }}>
                    <input
                        type="text"
                        placeholder="Search by name, email, or company..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            padding: '10px 16px',
                            background: 'rgba(0,0,0,0.3)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            color: '#fff',
                            fontSize: '14px',
                            outline: 'none'
                        }}
                    />

                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        style={{
                            padding: '10px 16px',
                            background: 'rgba(0,0,0,0.3)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            color: '#fff',
                            fontSize: '14px',
                            outline: 'none'
                        }}
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="contacted">Contacted</option>
                        <option value="resolved">Resolved</option>
                    </select>

                    <select
                        value={selectedBudget}
                        onChange={(e) => setSelectedBudget(e.target.value)}
                        style={{
                            padding: '10px 16px',
                            background: 'rgba(0,0,0,0.3)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            color: '#fff',
                            fontSize: '14px',
                            outline: 'none'
                        }}
                    >
                        <option value="">All Budgets</option>
                        <option value="< ₹1 Lakh">{'< ₹1 Lakh'}</option>
                        <option value="₹1–5 Lakh">₹1–5 Lakh</option>
                        <option value="₹5–15 Lakh">₹5–15 Lakh</option>
                        <option value="₹15–50 Lakh">₹15–50 Lakh</option>
                        <option value="₹50 Lakh+">₹50 Lakh+</option>
                    </select>
                </div>
            </div>

            {/* Main Content - Query List and Detail View */}
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: selectedQuery ? '1fr 1fr' : '1fr',
                gap: '24px'
            }}>
                {/* Queries List */}
                <div>
                    <div style={{ marginBottom: '16px' }}>
                        <h3 style={{ color: '#fff', fontSize: '18px' }}>
                            All Queries ({filteredQueries.length})
                        </h3>
                    </div>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        maxHeight: 'calc(100vh - 300px)',
                        overflowY: 'auto'
                    }}>
                        <AnimatePresence>
                            {filteredQueries?.map((query, index) => (
                                <motion.div
                                    key={query._id} // ✅ fix
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}

                                    style={{
                                        background: selectedQuery?._id === query._id
                                            ? 'rgba(96,165,250,0.15)'
                                            : 'rgba(17,24,39,0.7)',
                                        border: `1px solid ${selectedQuery?._id === query._id
                                            ? '#60a5fa'
                                            : 'rgba(255,255,255,0.1)'
                                            }`,
                                        backdropFilter: 'blur(10px)',
                                        borderRadius: '12px',
                                        padding: '16px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {/* TOP */}
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'start',
                                        marginBottom: '12px'
                                    }}>
                                        <div>
                                            <div style={{ fontWeight: 600, color: '#fff' }}>{query.name}</div>
                                            <div style={{ fontSize: '13px', color: '#9ca3af' }}>{query.phone}</div>
                                            <div style={{ fontSize: '13px', color: '#9ca3af' }}>{query.email}</div>
                                            {query.company && (
                                                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                                                    {query.company}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* MESSAGE */}
                                    <div style={{
                                        fontSize: '13px',
                                        color: 'rgba(255,255,255,0.7)',
                                        marginBottom: '10px'
                                    }}>
                                        {query.message}
                                    </div>

                                    {/* SERVICES */}
                                    <div style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: '6px',
                                        marginBottom: '10px'
                                    }}>
                                        {query.services?.map((s, i) => (
                                            <span key={i} style={{
                                                fontSize: '10px',
                                                padding: '4px 8px',
                                                borderRadius: '6px',
                                                background: 'rgba(96,165,250,0.1)',
                                                color: '#60a5fa'
                                            }}>
                                                {s}
                                            </span>
                                        ))}
                                    </div>

                                    {/* FOOTER */}
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        fontSize: '11px',
                                        color: 'rgba(255,255,255,0.4)'
                                    }}>
                                        <span>
                                            {new Date(query.createdAt).toLocaleString()}
                                        </span>
                                        <span>{query.budget}</span>
                                    </div>

                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>



            </div>
        </div>
    )
}

export default AdminContactQueries