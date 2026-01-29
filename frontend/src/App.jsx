import React, { useEffect, useState, useMemo, useRef } from 'react';
import { fetchTickets } from './services/api';
import PriorityChart from './components/PriorityChart';
import TopBarChart from './components/TopBarChart';
import AIAnalyst from './components/AiAnalysis';         // <--- NUEVO
import SprintSimulator from './components/SprintSimulator'; // <--- NUEVO
import html2canvas from 'html2canvas'; // <--- LIBRERÍA PDF
import jsPDF from 'jspdf';             // <--- LIBRERÍA PDF

import { 
  LayoutGrid, List, Search, ArrowUpDown, 
  Activity, Database, Shield, Zap, 
  BarChart2, TrendingUp, AlertTriangle, Clock, Download
} from 'lucide-react'; 
import './App.scss';

function App() {
  const [screen, setScreen] = useState('welcome');
  const [tickets, setTickets] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'score', direction: 'desc' });
  const [viewMode, setViewMode] = useState('grid');
  const [chartView, setChartView] = useState('matrix');
  const [isAnimating, setIsAnimating] = useState(false);

  // REFERENCIA PARA EL PDF (Capturaremos todo lo que esté dentro de este ref)
  const dashboardRef = useRef(null);

  useEffect(() => {
    // Initial load logic if needed
  }, []);

  const handleStart = async () => {
    setScreen('loading');
    setTimeout(async () => {
      try {
        const data = await fetchTickets();
        setTickets(data);
        setScreen('dashboard');
      } catch (error) {
        console.error("Error booting system", error);
      }
    }, 1500);
  };

  // --- PDF EXPORT FUNCTION ---
  const handleExportPDF = async () => {
    if (!dashboardRef.current) return;
    
    // Feedback visual simple
    const btn = document.getElementById('export-btn');
    if(btn) btn.innerText = 'Generating...';

    try {
      const canvas = await html2canvas(dashboardRef.current, {
        scale: 2, // Mejor resolución
        backgroundColor: '#0f172a', // Asegurar fondo oscuro
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`CloudAppX_Strategic_Report_${new Date().toISOString().slice(0,10)}.pdf`);
    } catch (err) {
      console.error("PDF Failed", err);
    } finally {
      if(btn) btn.innerHTML = '<span class="flex gap-2 items-center">Download Report</span>';
    }
  };

  const changeChartView = (newView) => {
    if (newView === chartView) return;
    setIsAnimating(true);
    setTimeout(() => {
      setChartView(newView);
      setIsAnimating(false);
    }, 400); 
  };

  const handleTicketClick = (id) => {
    setSelectedTicketId(id);
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // --- DATA LOGIC ---
  const topCritical = useMemo(() => [...tickets].sort((a,b) => b.score - a.score).slice(0, 5), [tickets]);
  const topROI = useMemo(() => [...tickets].sort((a,b) => b.business_value - a.business_value).slice(0, 5), [tickets]);
  const topQuickWins = useMemo(() => [...tickets].filter(t => t.business_value >= 3).sort((a,b) => a.effort_hours - b.effort_hours).slice(0, 5), [tickets]);

  const processedTickets = useMemo(() => {
    let result = [...tickets];
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(t => t.title.toLowerCase().includes(lowerQuery) || t.module.toLowerCase().includes(lowerQuery) || t.id.toLowerCase().includes(lowerQuery));
    }
    result.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }, [tickets, searchQuery, sortConfig]);

  const requestSort = (key) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') direction = 'asc';
    setSortConfig({ key, direction });
  };

  const renderActiveChart = () => {
    switch(chartView) {
      case 'matrix': return <PriorityChart tickets={tickets} selectedId={selectedTicketId} onTicketClick={handleTicketClick} />;
      case 'critical': return <TopBarChart data={topCritical} title="Top 5 Critical Threats" dataKey="score" label="Score" color="#f97316" onTicketClick={handleTicketClick} />;
      case 'roi': return <TopBarChart data={topROI} title="Top 5 High ROI Opportunities" dataKey="business_value" label="Value" color="#06b6d4" onTicketClick={handleTicketClick} />;
      case 'quick': return <TopBarChart data={topQuickWins} title="Top 5 Quick Wins" dataKey="effort_hours" label="Hours" color="#22c55e" onTicketClick={handleTicketClick} />;
      default: return null;
    }
  };

  // --- SCREENS ---
  if (screen === 'welcome') {
    return (
      <div className="app-container">
        <div className="welcome-screen">
          <div style={{ marginBottom: 20 }}><Zap size={60} color="#f97316" /></div>
          <h1>CloudAppX</h1>
          <p>Technical Debt Prioritization System v3.0 (AI Enabled)</p>
          <button className="start-btn" onClick={handleStart}>Initialize System</button>
        </div>
      </div>
    );
  }

  if (screen === 'loading') {
    return (
      <div className="app-container">
        <div className="loading-screen">
          <div className="spinner"></div>
          <h2>Initializing AI Core...</h2>
          <p style={{color: '#94a3b8'}}>Connecting to Google Gemini Engine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container" style={{ alignItems: 'flex-start' }}>
      
      {/* WRAPPER FOR PDF CAPTURE */}
      <div className="dashboard-container" ref={dashboardRef}>
        
        {/* HEADER */}
        <header>
          <div className="brand">
            <h2>CloudAppX Monitor</h2>
            <span>DECISION SUPPORT SYSTEM</span>
          </div>
          <div style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
            {/* COMPONENTE AI */}
            <AIAnalyst />
            
            {/* BOTÓN PDF */}
            <button id="export-btn" onClick={handleExportPDF} className="export-btn" style={{ 
              background: 'rgba(255,255,255,0.1)', border: '1px solid #475569', color: '#cbd5e1', 
              padding: '8px 15px', borderRadius: '20px', cursor: 'pointer', display: 'flex', gap: 5 
            }}>
              <Download size={16} /> Export PDF
            </button>
          </div>
        </header>

        {/* --- MAIN GRID LAYOUT --- */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 30, marginBottom: 30 }}>
            
            {/* LEFT COLUMN: CHARTS */}
            <div>
              <div className="chart-tabs">
                <button className={chartView === 'matrix' ? 'active' : ''} onClick={() => changeChartView('matrix')}><Activity size={18} /> Strategic Matrix</button>
                <button className={`danger ${chartView === 'critical' ? 'active' : ''}`} onClick={() => changeChartView('critical')}><AlertTriangle size={18} /> Critical Risks</button>
                <button className={chartView === 'roi' ? 'active' : ''} onClick={() => changeChartView('roi')}><TrendingUp size={18} /> High ROI</button>
                <button className={`success ${chartView === 'quick' ? 'active' : ''}`} onClick={() => changeChartView('quick')}><Clock size={18} /> Quick Wins</button>
              </div>

              <section className="chart-section" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 20, overflow: 'hidden', height: 400 }}>
                <div className={`chart-carousel-container ${isAnimating ? 'slide-exit' : 'slide-enter'}`}>
                  {renderActiveChart()}
                </div>
              </section>
            </div>

            {/* RIGHT COLUMN: SIMULATOR */}
            <div>
              {/* COMPONENTE SIMULADOR */}
              <SprintSimulator tickets={tickets} />
            </div>
        </div>

        {/* CONTROLS BAR */}
        <div className="controls-bar">
          <div className="search-box">
            <Search className="search-icon" size={18} />
            <input type="text" placeholder="Search tickets..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <button className={`filter-btn ${sortConfig.key === 'score' ? 'active' : ''}`} onClick={() => requestSort('score')}><BarChart2 size={16} /> Sort Score</button>
          <button className={`filter-btn ${sortConfig.key === 'business_value' ? 'active' : ''}`} onClick={() => requestSort('business_value')}><ArrowUpDown size={16} /> Sort Value</button>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
            <button className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}><LayoutGrid size={18} /></button>
            <button className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}><List size={18} /></button>
          </div>
        </div>

        {/* TICKETS DISPLAY */}
        <div className={`tickets-container ${viewMode === 'list' ? 'list-view' : 'grid-view'}`}>
          {processedTickets.map((ticket) => (
            <div 
              key={ticket.id} 
              id={ticket.id} 
              className={`ticket-card ${selectedTicketId === ticket.id ? 'is-selected' : ''}`}
              onClick={() => handleTicketClick(ticket.id)}
              style={{ cursor: 'pointer' }}
            >
              <div className="card-header">
                <div>
                  <h4 style={{ margin: 0, color: '#94a3b8' }}>{ticket.id}</h4>
                  <span className="tag" style={{ background: 'rgba(255,255,255,0.1)', marginTop: 5, display: 'inline-block' }}>{ticket.module}</span>
                </div>
                <div className="score-circle">{ticket.score}</div>
              </div>
              <div className="card-body">
                <h3 style={{ margin: '10px 0', fontSize: '1.1rem' }}>{ticket.title}</h3>
              </div>
              <div className="card-footer" style={{ marginTop: 15, fontSize: '0.9rem', color: '#cbd5e1', display: 'flex', gap: 15 }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Shield size={14} color={ticket.severity >= 4 ? '#ef4444' : '#22c55e'} /> Sev: {ticket.severity}</div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Database size={14} color="#f97316" /> Val: {ticket.business_value}</div>
                 <div>⏱ {ticket.effort_hours}h</div>
              </div>
            </div>
          ))}
          {processedTickets.length === 0 && <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8', gridColumn: '1 / -1' }}>No tickets found matching your criteria.</div>}
        </div>

      </div>
    </div>
  );
}

export default App;