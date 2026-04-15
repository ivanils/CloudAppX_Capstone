
# 🚀 CloudAppX: Technical Debt Prioritization System

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini_AI-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

> **Live Demo:** [https://cloudappx.ivanllanos.com](https://cloudappx.ivanllanos.com)

## 📌 Overview & Business Value
Bridging the gap between engineering and business stakeholders is one of the hardest challenges in software development. CloudAppX is a Full-Stack Decision Support System designed to translate **Technical Debt into Business Risk**. 

Instead of arguing over "code refactoring," this tool leverages data-driven prioritization (Cost of Delay & ROI) and **Generative AI** to output executive-ready strategic reports. This ensures development teams and stakeholders are always aligned on what to build next.

This project was developed as a comprehensive Capstone to showcase advanced end-to-end full-stack architecture, cloud deployment, and AI integration.

## 🌟 Key Features
* **🧠 AI-Powered Executive Reports:** Integrates Google Gemini 1.5 Flash to automatically analyze the current sprint backlog and generate downloadable PDF reports for stakeholders.
* **📊 Strategic Matrix Simulator:** Interactive UI displaying ROI vs. Effort analysis to quickly identify "Quick Wins" and "Critical Risks".
* **⚡ Lazy Loading & Optimized UX:** Strategic state management in React ensures the backend is only queried on-demand, saving cloud resources while maintaining a smooth UI with synthetic loading states.
* **📱 Fully Responsive Design:** Fluid layout adapting perfectly to mobile and desktop environments without horizontal overflow issues.

## 🏗️ Architecture & Infrastructure
The application follows a decoupled, microservices-oriented architecture:

* **Frontend:** Built with **React** and **Vite**. Deployed on **Vercel** with a custom domain and strict HTTPS configurations.
* **Backend:** Built with **Python** and **FastAPI**. Deployed on **Render**. 
* **DevOps & Cloud:**
  * Automated CI/CD pipeline via GitHub Webhooks.
  * Strict CORS policies limiting API access only to production and local development origins.
  * Implementend a `/ping` health-check endpoint monitored by UptimeRobot to prevent server cold-starts and ensure sub-second response times.

## 💻 Local Setup & Installation

If you want to run this project locally, follow these steps:

### 1. Clone the repository
```bash
git clone [https://github.com/YOUR_GITHUB_USERNAME/cloud-app-x-capstone.git](https://github.com/YOUR_GITHUB_USERNAME/cloud-app-x-capstone.git)
cd cloud-app-x-capstone
```

### 2. Backend Setup (FastAPI)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install -r requirements.txt
```
*Create a `.env` file in the backend directory and add your Google Gemini API Key:*
`GEMINI_API_KEY=your_api_key_here`

*Run the server:*
```bash
uvicorn main:app --reload
```

### 3. Frontend Setup (React/Vite)
```bash
cd frontend
npm install
npm run dev
```

## 👨‍💻 Author
Designed and engineered by an **IT Solution Developer & Full-Stack Architect** passionate about solving complex business problems with scalable code. 

Let's connect: [Your LinkedIn Profile URL]
```

***

### 📝 Qué necesitas cambiar antes de subirlo:
1.  **[Tu Link de GitHub]**: En las instrucciones de clonación, asegúrate de poner el enlace real a tu repositorio.
2.  **[Tu Link de LinkedIn]**: Abajo del todo, pon la URL de tu perfil.
3.  **(Opcional pero muy recomendado)**: Justo debajo de `> **Live Demo:** [Enlace]`, añade un GIF animado de 5 segundos mostrando la matriz y el reporte PDF. Queda visualmente increíble en GitHub.

Con este README, cualquier persona que inspeccione tu repositorio verá inmediatamente que no eres un programador junior que solo "pica código", sino un arquitecto de soluciones que entiende de infraestructura, optimización de recursos y valor de negocio.

¿Lo integramos y preparamos el contenido exacto del post de LinkedIn? Ya tienes todo el ecosistema montado. 🚀