import React, { useState, useMemo } from "react";
import { Gauge, CheckCircle, AlertTriangle } from 'lucide-react';

const SprintSimulator = ({ tickets }) => {
    const [capacity, setCapacity] = useState(0); // default capacity in hours

    // smart algorithm to select tickets based on capacity
    const simulation = useMemo(() => {
        if (!tickets || !Array.isArray(tickets) || tickets.length === 0 || capacity <= 0) {
            return {
                currentHours: 0,
                totalValue: 0,
                selectedCount: 0,
                selectedTickets: []
            };
        }

        // First we calculate  ROI (Valu/Effort)
        const candidates = tickets.map(t => {
            // Force conversion to integer
            const val = Number(t.business_value) || 0;
            const effort = Number(t.effort_hours) || 1; // Avoid division by zero
            return {
                ...t,
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
                if (ticket.id) selectedTickets.push(ticket.id);
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
            <div className="car-header">
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
                    min="0" max="300" step="10"
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

            {capacity > 0 && (
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
            )}
        </div>
    );
}
export default SprintSimulator;