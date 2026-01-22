import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';



const CustomTooltip = ({ active, payload, label, dataKey, color }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div style={{ backgroundColor: '#0f172a', padding: '10px', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}>
        <p style={{ margin: 0, fontWeight: 'bold', color }}>{d.id}</p>
        <p style={{ margin: '5px 0', fontSize: '0.8rem' }}>{d.title}</p>
        <p style={{ margin: 0 }}>{label}: <strong>{d[dataKey]}</strong></p>
      </div>
    );
  }
  return null;
};
        
const TopBarChart = ({ data, title, color, dataKey, label, onTicketClick }) => {

  return (
    <div style={{ width: '100%', height: 350 }}>
      <h3 style={{ textAlign: 'center', color: '#f8fafc', marginBottom: 5 }}>{title}</h3>
      <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>Top 5 Analysis</p>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical" // horizontal to read titles better
          margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
          <XAxis type="number" stroke="#94a3b8" hide />
          <YAxis 
            type="category" 
            dataKey="id" 
            stroke="#94a3b8" 
            width={60} 
            tick={{fill: '#cbd5e1', fontSize: 12}} 
          />
          <Tooltip content={<CustomTooltip label={label} dataKey={dataKey} color={color} />} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
          
          <Bar dataKey={dataKey} radius={[0, 4, 4, 0]} animationDuration={1000}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={color} 
                fillOpacity={0.8 + (index * 0.05)}
                className="bar-cell-interactive"
                onClick={() => onTicketClick(entry.id)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopBarChart;