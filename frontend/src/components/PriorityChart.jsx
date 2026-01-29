import React from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Label
} from 'recharts';

// Custom component for the dots in the plot
// Recharts passes props like cx, cy, payload, etc.
const CustomizedDot = (props) => {
  const { cx, cy, payload, selectedId, onTicketClick } = props;
  
  // Verification if this dot is the selected one
  const isSelected = selectedId === payload.id;

  return (
    <circle
      cx={cx}
      cy={cy}
      r={isSelected ? 10 : 6}
      fill="#06b6d4"
      stroke="none"
      className={`chart-dot ${isSelected ? 'selected' : ''}`}
      onClick={() => onTicketClick(payload.id)}
    />
  );
};

// Custom Tooltip component
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{ backgroundColor: '#0f172a', padding: '12px', border: '1px solid #334155', borderRadius: '8px', color: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
        <p style={{ margin: 0, fontWeight: 'bold', color: '#f97316' }}>{data.id}</p>
        <p style={{ margin: '5px 0', fontSize: '0.9rem' }}>{data.title}</p>
        <p style={{ margin: 0, color: '#06b6d4', fontWeight: 'bold' }}>Score: {data.score}</p>
      </div>
    );
  }
  return null;
};

// Main component of the Priority chart
const PriorityChart = ({ tickets, selectedId, onTicketClick }) => {

  return (
    <div style={{ width: '100%', height: 350 }}>
      <h3 style={{ textAlign: 'center', color: '#f8fafc', marginBottom: 5 }}>Strategic Matrix</h3>
      <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>ROI vs. Effort Analysis</p>

      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 30, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis type="number" dataKey="effort_hours" name="Effort" unit="h" stroke="#94a3b8" tick={{fill: '#64748b'}}>
             <Label value="Effort (Hours)" offset={-20} position="insideBottom" fill="#64748b" />
          </XAxis>
          <YAxis type="number" dataKey="business_value" name="Value" stroke="#94a3b8" tick={{fill: '#64748b'}} domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]}>
             <Label value="Business Value" angle={-90} position="insideLeft" fill="#64748b" style={{textAnchor: 'middle'}} />
          </YAxis>
          
          {/* Invisible cursor for tooltip for not screw the hover function*/}
          <Tooltip content={<CustomTooltip />} cursor={false} />
          
          <ReferenceLine x={50} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'top', value: 'High Effort Risk', fill: '#ef4444', fontSize: 10 }} />
          <ReferenceLine y={5} stroke="#22c55e" strokeDasharray="3 3" label={{ position: 'right', value: 'Min Value Target', fill: '#22c55e', fontSize: 10 }} />
          
          <Scatter 
            name="Tickets" 
            data={tickets} 
            shape={<CustomizedDot selectedId={selectedId} onTicketClick={onTicketClick} />} 
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriorityChart;