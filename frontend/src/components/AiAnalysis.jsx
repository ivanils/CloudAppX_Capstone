import React, { useState } from "react";
import axios from "axios";
import { Bot, FileText, Sparkles, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const AiAnalyst = () => {
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const generateReport = async () => {
        setLoading(true);
        setIsOpen(true);
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/analyze', {});
            setReport(response.data.analysis);
        } catch (error) {
            setReport(`Error generating report. Please try again. Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }
    if (!isOpen) {
        return (
            <button
                onClick={generateReport}
                className="ai-trigger-btn"
            >
                <Sparkles size={18} /> Ask AI Tech Expert
            </button>
        );
    } else {
        return (
            <div className="ai-modal-overlay">
                <div className="ai-panel">
                    <button onClick={() => setIsOpen(false)}>
                        <X size={24} />
                    </button>

                    <div className="ai-panel-top">
                        <div className="ai-icon-circle">
                            <Bot size={32} color="#a855f7" />
                        </div>
                        <h2>AI Strategic Analysis</h2>
                        <p>Powered by Google Gemini Pro</p>
                    </div>

                    <div className="ai-panel-content">
                        {loading ? (
                            <div className="ai-loading">
                                <div className="spinner" style={{ margin: '0 auto 15px' }}></div>
                                <p className="animate-pulse">Analyzing technical debt patterns...</p>
                            </div>
                        ) : (
                            <div className="markdown-content">
                                <div style={{ whiteSpace: 'pre-line' }}>{report}</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default AiAnalyst;