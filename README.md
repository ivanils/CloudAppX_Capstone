<!-- # 🚀 CloudAppX - Intelligent Technical Debt Prioritization

![React](https://img.shields.io/badge/Frontend-React_Vite-61DAFB?style=for-the-badge&logo=react)
![Python](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi)
![AI](https://img.shields.io/badge/AI-Google_Gemini-8E75B2?style=for-the-badge&logo=google)

**CloudAppX** is a Decision Support System (DSS) designed to help CTOs and IT Managers prioritize technical debt effectively. Unlike traditional backlogs, CloudAppX uses a **Weighted Scoring Model**, **Generative AI**, and **Resource Simulation** to transform raw tickets into strategic business decisions.

---

## ✨ Key Features

### 📊 1. Strategic Visualization Matrix
* **Interactive Scatter Plot:** Visualizes tickets based on *Business Value (ROI)* vs. *Effort*.
* **Dynamic Filtering:** Real-time search and sorting algorithms.
* **Quadrant Analysis:** Identifies "Quick Wins", "Major Projects", and "Money Pits".

### 🤖 2. AI Executive Analyst (Virtual CTO)
* **Powered by Google Gemini 1.5 Flash:** Analyzes the backlog metadata in real-time.
* **Risk Assessment:** Identifies critical security vulnerabilities (e.g., SQL Injection) automatically.
* **Strategic Advice:** Generates natural language recommendations for the next sprint.
* *Note: Includes a robust "Simulation Mode" fallback if the AI API is unreachable.*

### 🎛️ 3. Sprint Planning Simulator
* **Resource Optimization:** Uses a "Greedy Algorithm" to select the optimal combination of tickets that fit within a specific hour capacity (e.g., 80 hours).
* **Real-time ROI Calculation:** Instantly updates the projected business value delivered.
* **Interactive UI:** Hover tooltips with detailed ticket metrics.

### 📄 4. Enterprise Reporting
* **Hybrid PDF Export:** Generates a professional PDF report combining:
    * Vector-based text and tables (using `jspdf-autotable`).
    * High-resolution snapshots of the current charts (using `html2canvas`).

---

## 🛠️ Technology Stack

### Frontend (Client)
* **Framework:** React 18 (Vite)
* **Styling:** SCSS with **Glassmorphism** & CSS Animations (Modern Mesh Background).
* **Data Viz:** Recharts.
* **Reporting:** jsPDF, jspdf-autotable, html2canvas.
* **UX/UI:** Lucide React (Icons), Sonner (Toast Notifications).

### Backend (Server)
* **Framework:** Python FastAPI.
* **AI Engine:** Google Generative AI SDK (`google-generativeai`).
* **Data Processing:** Pandas.
* **Server:** Uvicorn.

---

## ⚡ Installation & Setup Guide

Follow these steps to run the project locally.

### Prerequisites
* Node.js (v16+)
* Python (v3.9+)
* Google Gemini API Key (Get it for free at [Google AI Studio](https://aistudio.google.com/))

### 1. Backend Setup (The Brain)

Navigate to the backend folder:
```bash
cd backend -->