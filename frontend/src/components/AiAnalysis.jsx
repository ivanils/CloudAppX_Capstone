import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bot, FileText, Sparkles, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { toast } from "sonner";

const AiAnalyst = ({ onReportGenerated, onStateChange }) => {
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (onStateChange) {
            onStateChange(isOpen);
        }
    }, [isOpen, onStateChange]);

    const generateReport = async () => {
        setLoading(true);
        setIsOpen(true);
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/analyze', {});
            const text = response.data.analysis;
            setReport(text);

            if (onReportGenerated) {
                onReportGenerated(text);
            }

            toast.info('AI Analysis completed.');
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

                    {/* Header */}
                    <div className="ai-header" >
                        <div className="ai-icon-circle" >
                            <Bot size={24} color="#a78bfa" />
                        </div>
                        <div>
                            <h2>AI Strategic Analysis</h2>
                            <span>Powered by Google Gemini
                                <img className="gemini-icon" src="https://favicon.im/gemini.google.com" alt="gemini.google.com favicon" />
                            </span>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Content Area con Scroll */}
                    <div className="ai-panel-content">
                        {loading ? (
                            <div className="ai-loading">
                                <div className="spinner"></div>
                                <p className="animate-pulse">Analyzing data points...</p>
                            </div>
                        ) : (
                            // AQUI ESTA LA MAGIA DEL MARKDOWN
                            <div className="markdown-content">
                                <ReactMarkdown>{report}</ReactMarkdown>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

}

export default AiAnalyst;