import React, { useEffect, useState, useMemo } from 'react';
import { fetchTickets } from './services/api';
import PriorityChart from './components/PriorityChart';
import TopBarChart from './components/TopBarChart';
import AIAnalyst from './components/AiAnalysis';
import SprintSimulator from './components/SprintSimulator';
import { toast } from 'sonner';
import infinityLogo from './assets/infinity_logo.png';

// Librerías para PDF Híbrido
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';

import {
  LayoutGrid, List, Search, ArrowUpDown,
  Activity, Database, Shield, Zap,
  BarChart2, TrendingUp, AlertTriangle, Clock, Download
} from 'lucide-react';
import './App.scss';

function App() {
  // --- STATE MANAGEMENT ---
  const [screen, setScreen] = useState('welcome');
  const [tickets, setTickets] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  // Interactivity
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'score', direction: 'desc' });
  const [viewMode, setViewMode] = useState('grid');

  // Carousel & Animation
  const [chartView, setChartView] = useState('matrix');
  const [isAnimating, setIsAnimating] = useState(false);

  // PDF Data
  const [aiReportText, setAiReportText] = useState("");
  const [isAIActive, setIsAIActive] = useState(false);

  // --- LIFECYCLE ---
  useEffect(() => {
    const prefetchData = async () => {
      try {
        const data = await fetchTickets();
        setTickets(data); 
      } catch (error) {
        console.error("Waking up server error:", error);
      }
    };

    prefetchData();
  }, []);

  const handleStart = async () => {
    setScreen('loading');
    // setTimeout(async () => {
    //   try {
    //     const data = await fetchTickets();
    //     setTickets(data);
    //     setScreen('dashboard');
    //   } catch (error) {
    //     console.error("Error booting system", error);
    //   }
    // }, 1500);
    setTimeout(() => {
      setScreen('dashboard');
    }, 1500);
  };

  // --- HYBRID PDF EXPORT FUNCTION ---
  const handleExportPDF = async () => {
    const btn = document.getElementById('export-btn');
    if (btn) btn.innerText = 'Generating...';

    try {
      const doc = new jsPDF();
      const today = new Date().toLocaleDateString();

      // 1. HEADER (Vectorial)
      doc.setFillColor(15, 23, 42); // Azul Oscuro
      doc.rect(0, 0, 210, 40, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.text("CloudAppX", 14, 20);

      doc.setFontSize(12);
      doc.setTextColor(148, 163, 184);
      doc.text(`Strategic Technical Debt Report | ${today}`, 14, 30);

      let yPos = 50;

      // 2. AI SUMMARY 
      if (aiReportText) {
        const primaryColor = [54, 105, 199]; // #3669c7 
        const textColor = [51, 65, 85];
        const pageHeight = doc.internal.pageSize.getHeight();

        // sec title
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Executive AI Summary", 14, yPos);
        yPos += 10;

        const paragraphs = aiReportText.split('\n');

        paragraphs.forEach(paragraph => {
          if (paragraph.trim() === '') {
            yPos += 3;
            return;
          }

          let currentText = paragraph;
          let indent = 14;
          let isTitle = false;

          // titles styles ( ## and ###)
          if (currentText.startsWith('## ')) {
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            currentText = currentText.replace(/^##\s/, '');
            isTitle = true;
          }
          else if (currentText.startsWith('### ')) {
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            currentText = currentText.replace(/^###\s/, '');
            isTitle = true;
          }
          // list styles ( * and - )
          else if (currentText.trim().startsWith('* ') || currentText.trim().startsWith('- ')) {
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(textColor[0], textColor[1], textColor[2]);
            indent = currentText.startsWith('  ') ? 22 : 18;
            currentText = currentText.trim().replace(/^[-]\s/, '•  ');
          }
          // regular text
          else {
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(textColor[0], textColor[1], textColor[2]);
          }

          // bold inline text (**)
          const lines = doc.splitTextToSize(currentText, 180 - (indent - 14));

          lines.forEach(line => {
            if (yPos > pageHeight - 20) {
              doc.addPage();
              yPos = 20;
            }

            if (isTitle) {
              doc.text(line, indent, yPos);
            } else {
              let xOffset = indent;
              const parts = line.split(/(\*\*.*?\*\*)/g); // Divide la línea por los tags **

              parts.forEach(part => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  // blue blod fragments
                  const boldText = part.replace(/\*\*/g, '');
                  doc.setFont("helvetica", "bold");
                  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
                  doc.text(boldText, xOffset, yPos);
                  xOffset += doc.getTextWidth(boldText);
                } else {
                  // regular fragments
                  doc.setFont("helvetica", "normal");
                  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
                  doc.text(part, xOffset, yPos);
                  xOffset += doc.getTextWidth(part);
                }
              });
            }
            yPos += 6;
          });
          yPos += 2; // spacing between paragraphs
        });

        yPos += 10;
      }

      // 3. CHART SNAPSHOT 
      // capture only the chart section 
      const chartElement = document.getElementById('chart-capture-zone');
      if (chartElement) {
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text("Current Visualization Snapshot", 14, yPos);
        yPos += 5;

        // use html2canvas to capture the chart area as a high-res image
        const canvas = await html2canvas(chartElement, {
          scale: 2, // high res
          backgroundColor: '#0f172a',
          useCORS: true
        });

        const imgData = canvas.toDataURL('image/png');

        // adjust image size to fit within PDF width while maintaining aspect ratio
        const imgProps = doc.getImageProperties(imgData);
        const pdfWidth = 140;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        // new page if image exceeds remaining space
        if (yPos + pdfHeight > 280) {
          doc.addPage();
          yPos = 20;
        }

        doc.addImage(imgData, 'PNG', 14, yPos, pdfWidth, pdfHeight);
        yPos += pdfHeight + 15;
      }

      // 4. CRITICAL RISKS TABLE (Vectorial - AutoTable)
      if (yPos > 240) { doc.addPage(); yPos = 20; }

      doc.setFontSize(14);
      doc.setTextColor(220, 38, 38);
      doc.text("Top Critical Risks", 14, yPos);
      yPos += 5;

      const criticalData = [...tickets].sort((a, b) => b.score - a.score).slice(0, 5);

      autoTable(doc, {
        startY: yPos,
        head: [['ID', 'Title', 'Module', 'Severity', 'Value', 'Effort (h)', 'Score']],
        body: criticalData.map(t => [t.id, t.title, t.module, t.severity, t.business_value, t.effort_hours, t.score]),
        theme: 'grid',
        headStyles: { fillColor: [220, 38, 38] },
      });

      yPos = doc.lastAutoTable.finalY + 15;

      // 5. FULL BACKLOG (Vectorial)
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("Prioritized Backlog", 14, yPos);

      autoTable(doc, {
        startY: yPos + 5,
        head: [['ID', 'Title', 'Module', 'Value', 'Effort (h)', 'Score']],
        body: tickets.map(t => [t.id, t.title, t.module, t.business_value, t.effort_hours, t.score]),
        theme: 'striped',
        headStyles: { fillColor: [15, 23, 42] },
      });

      doc.save('CloudAppX_Master_Report.pdf');
      toast.success('Executive Report Generated successfully!');

    } catch (err) {
      console.error("PDF Gen Failed", err);
      toast.error('Failed to generate PDF.');
    } finally {
      if (btn) btn.innerHTML = '<span class="flex gap-2">Download PDF</span>';
    }
  };

  // --- CHART LOGIC ---
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

  // Data processing
  const topCritical = useMemo(() => [...tickets].sort((a, b) => b.score - a.score).slice(0, 5), [tickets]);
  const topROI = useMemo(() => [...tickets].sort((a, b) => b.business_value - a.business_value).slice(0, 5), [tickets]);
  const topQuickWins = useMemo(() => [...tickets].filter(t => t.business_value >= 3).sort((a, b) => a.effort_hours - b.effort_hours).slice(0, 5), [tickets]);

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
    switch (chartView) {
      case 'matrix': return <PriorityChart tickets={tickets} selectedId={selectedTicketId} onTicketClick={handleTicketClick} />;
      case 'critical': return <TopBarChart data={topCritical} title="Top 5 Critical Threats" dataKey="score" label="Score" color="#f97316" onTicketClick={handleTicketClick} />;
      case 'roi': return <TopBarChart data={topROI} title="Top 5 High ROI Opportunities" dataKey="business_value" label="Value" color="#06b6d4" onTicketClick={handleTicketClick} />;
      case 'quick': return <TopBarChart data={topQuickWins} title="Top 5 Quick Wins" dataKey="effort_hours" label="Hours" color="#22c55e" onTicketClick={handleTicketClick} />;
      default: return null;
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      maximumFractionDigits: 0,
    }).format(value * 1000);
  };
  // --- VIEWS ---
  if (screen === 'welcome') {
    return (
      <div className="app-container">
        <div className="welcome-screen">
          <div style={{ marginBottom: 20 }}><img alt='infinity logo' src={infinityLogo} style={{ maxWidth: '75px', height: 'auto' }} /></div>
          <h1>CloudAppX</h1>
          <p>Technical Debt Prioritization System v3.0</p>
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
          <span style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 5 }}>
            Connecting to
            <img className="gemini-icon" src="https://favicon.im/gemini.google.com" alt="gemini.google.com favicon" />
            Google Gemini Engine...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container" style={{ alignItems: 'flex-start' }}>

      <div className="mesh-bg"></div>
      <div className="dashboard-container">
        {/* HEADER */}
        <header className={isAIActive ? 'header-ai-mode' : ''}>
          <div className="brand">
            <h2>CloudAppX Monitor</h2>
            <span>DECISION SUPPORT SYSTEM</span>
          </div>
          <div className="header-controls">
            <AIAnalyst onReportGenerated={setAiReportText} onStateChange={setIsAIActive} />
            <button id="export-btn" onClick={handleExportPDF} className="export-btn" style={{
              background: 'rgba(255,255,255,0.1)', border: '1px solid #475569', color: '#cbd5e1',
              padding: '8px 15px', borderRadius: '20px', cursor: 'pointer', display: 'flex', gap: 5, alignItems: 'center'
            }}>
              <Download size={16} /> Export PDF
            </button>
          </div>
        </header>
        <div className='main-wrapper'>
          {/* --- MAIN GRID LAYOUT --- */}
          <div className='main-grid-layout'>

            {/* LEFT COLUMN: CHARTS */}
            <div className='main-grid-left'>
              <div className="chart-tabs">
                <button className={chartView === 'matrix' ? 'active' : ''} onClick={() => changeChartView('matrix')}><Activity size={18} /> Strategic Matrix</button>
                <button className={`danger ${chartView === 'critical' ? 'active' : ''}`} onClick={() => changeChartView('critical')}><AlertTriangle size={18} /> Critical Risks</button>
                <button className={chartView === 'roi' ? 'active' : ''} onClick={() => changeChartView('roi')}><TrendingUp size={18} /> High ROI</button>
                <button className={`success ${chartView === 'quick' ? 'active' : ''}`} onClick={() => changeChartView('quick')}><Clock size={18} /> Quick Wins</button>
              </div>

              {/* ID AÑADIDO AQUI PARA LA CAPTURA PDF */}
              <section id="chart-capture-zone" className="chart-section" >
                <div className={`chart-carousel-container ${isAnimating ? 'slide-exit' : 'slide-enter'}`}>
                  {renderActiveChart()}
                </div>
              </section>
            </div>

            {/* RIGHT COLUMN: SIMULATOR */}
            <div className='main-grid-right'>
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Database size={14} color="#f97316" /> Val: {formatCurrency(ticket.business_value)}</div>
                  <div>⏱ {ticket.effort_hours}h</div>
                </div>
              </div>
            ))}
            {processedTickets.length === 0 && <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8', gridColumn: '1 / -1' }}>No tickets found matching your criteria.</div>}
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;