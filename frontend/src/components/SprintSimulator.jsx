import React, { useState, useMemo } from "react";
import { Gauge, CheckCircle, Info } from 'lucide-react';

const SprintSimulator = ({ tickets }) => {
    const [capacity, setCapacity] = useState(10); // default capacity in hours
    const [isExpanded, setIsExpanded] = useState(false);
    // smart algorithm to select tickets based on capacity
    const simulation = useMemo(() => {
        if (!tickets || !Array.isArray(tickets) || tickets.length === 0 || capacity <= 0) {
            return {
                currentHours: 0,
                totalValue: 0,
                selectedCount: 0,
                selectedTickets: [],
                candidates: []
            };
        }

        // First we calculate  ROI (Valu/Effort)
        const candidates = tickets.map(t => {
            // Force conversion to integer
            const val = Number(t.business_value) || 0;
            const effort = Number(t.effort_hours) || 1; // Avoid division by zero
            return {
                ...t,
                id: t.id ? String(t.id) : 'N/A',
                title: t.title ? String(t.title) : 'No Title',
                business_value: val,
                effort_hours: effort,
                safe_val: val,
                safe_effort: effort,
                roi: val / effort
            };
        });

        // Sort by descending ROI
        candidates.sort((a, b) => b.roi - a.roi);

        let currentHours = 0;
        let totalValue = 0;
        let selectedCount = 0;
        const selectedTickets = [];

        // Select tickets until we reach capacity
        for (let ticket of candidates) {
            if (currentHours + ticket.effort_hours <= capacity) {
                currentHours += ticket.effort_hours;
                totalValue += ticket.business_value;
                selectedCount++;
                selectedTickets.push(ticket);
            }
        }
        return {
            // Rpund to avoid decimals
            currentHours: Math.round(currentHours * 100) / 100,
            totalValue: Math.round(totalValue * 100) / 100,
            selectedCount,
            selectedTickets
        };
    }, [tickets, capacity]);

    return (
        <div className="card">
            <div className="card-header">
                <Gauge color="#22c55e" />
                <h3>Sprint Planning Simulator</h3>
            </div>

            <div className="capacity-control">
                <div className="capacity-label">
                    <span>Team Capacity</span>
                    <strong>{capacity} Hours</strong>
                </div>
                <input
                    type="range"
                    min="0" max="300" step="1"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="capacity-slider"
                />
            </div>

            <div className="simulation-results">
                <div className="simulation-result-card">
                    <div className="selected-count">{simulation.selectedCount}</div>
                    <div className="result-label">Tickets Solved</div>
                </div>
                <div className="simulation-result-card">
                    <div className="total-value">${simulation.totalValue}k</div>
                    <div className="result-value">Value Delivered</div>
                </div>
            </div>

            {/* {capacity > 0 && (
                <div className="selection-details">
                    <p>
                        <CheckCircle size={14} color="#22c55e" /> Optimal selection includes:
                    </p>
                    <div className="tag-container">
                        {simulation.selectedTickets.slice(0, 5).map(id => (
                            <span key={id} className="tag">
                                {id}
                            </span>
                        ))}
                        {simulation.selectedTickets.length > 5 && <span className="tag" style={{ color: '#94a3b8' }}>+{simulation.selectedTickets.length - 5} more</span>}
                    </div>
                </div>
            )} */}
            {capacity > 0 && (
                <div style={{ paddingTop: 15, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <p style={{ fontSize: '0.9rem', color: '#94a3b8', margin: 0, display: 'flex', alignItems: 'center', gap: 5 }}>
                            <CheckCircle size={14} color="#22c55e" /> Optimal selection:
                        </p>
                        {simulation.selectedTickets.length > 6 && (
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                style={{ background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer', fontSize: '0.8rem' }}
                            >
                                {isExpanded ? 'Show Less' : 'Show All'}
                            </button>
                        )}
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, maxHeight: 'auto',  padding: '5px', paddingTop: 0 }}>
                        {simulation.selectedTickets.length > 0 ? (
                            // Mostramos todos si está expandido, si no solo los primeros 6
                            (isExpanded ? simulation.selectedTickets : simulation.selectedTickets.slice(0, 6)).map((ticket, idx) => (

                                // --- TOOLTIP CONTAINER ---
                                <div key={idx} className="tooltip-container" style={{ position: 'relative' }}>

                                    <span className="tag" style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', fontSize: '0.75rem', padding: '4px 10px', borderRadius: '12px', cursor: 'help' }}>
                                        {ticket.id}
                                    </span>

                                    {/* EL TOOLTIP FLOTANTE */}
                                    <div className="tooltip-content">
                                        <strong>{ticket.title}</strong>
                                        <div style={{ marginTop: 5, fontSize: '0.8rem', color: '#cbd5e1' }}>
                                            ROI: {ticket.roi.toFixed(1)} | Value: {ticket.safe_val} | Cost: {ticket.safe_effort}h
                                        </div>
                                    </div>

                                </div>
                            ))
                        ) : (
                            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>No tickets fit.</span>
                        )}

                        {!isExpanded && simulation.selectedTickets.length > 6 && (
                            <span
                                onClick={() => setIsExpanded(true)}
                                className="tag"
                                style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#94a3b8', cursor: 'pointer', fontSize: '0.75rem', padding: '4px 10px' }}
                            >
                                +{simulation.selectedTickets.length - 6} more...
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
export default SprintSimulator;