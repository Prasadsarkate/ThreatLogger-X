# ⚡ ThreatLogger X

<p align="center">
  <b>Full-Stack Security Logging & Monitoring Tool</b>
  <br>
  Built with <b>FastAPI (Backend)</b> + <b>React (Frontend)</b>
</p>

---

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Python](https://img.shields.io/badge/Python-3.10+-yellow.svg?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)
![NPM](https://img.shields.io/badge/NPM-CB3837?logo=npm&logoColor=white)
![Issues](https://img.shields.io/github/issues/Prasadsarkate/ThreatLogger-X)
![Stars](https://img.shields.io/github/stars/Prasadsarkate/ThreatLogger-X?style=social)
![Contributions](https://img.shields.io/badge/Contributions-Welcome-brightgreen)

---

## 📑 Table of Contents
- [About](#-about)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Installation & Setup](#️-installation--setup)
- [Default Credentials](#-default-login-credentials)
- [Screenshots](#-screenshots)
- [Tech Stack](#-tech-stack)
- [Future Improvements](#-future-improvements)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)
- [Note](#-note)

---

## 📖 About

🚀 **ThreatLogger X** is a modern full-stack project designed to make **threat logging and monitoring** simple, secure, and efficient.
With a clean UI and powerful backend, it helps in recording suspicious activities and visualizing logs in real-time.

---

## 🚀 Features
- 🔐 Secure Login System (with default credentials)
- ⚡ High-performance **FastAPI backend**
- 🎨 Responsive **React frontend**
- 📊 Real-time monitoring dashboard
- 📝 Log history tracking
- 🖼️ Preview screenshots included

---

## 📂 Project Structure
```
ThreatLogger-X/
 ├── backend/       # FastAPI backend
 ├── frontend/      # React frontend
 ├── screenshot/    # Project screenshots
 └── README.md
```

---

## 🛠️ Installation & Setup

### 🔹 1. Backend (FastAPI)
```bash
cd backend
python -m venv venv
source venv/bin/activate   # Linux/Mac
venv\Scripts\activate      # Windows

pip install -r requirements.txt
uvicorn backend.app.main:app --reload
```
👉 Runs at: [http://127.0.0.1:8000](http://127.0.0.1:8000)

---

### 🔹 2. Frontend (React)
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm install react-scripts@5.0.1
npm start
```
👉 Runs at: [http://localhost:3000](http://localhost:3000)

---

## 🔑 Default Login Credentials
Use these credentials to log in:

- **Username:** `admin`
- **Password:** `admin123`

---

## 📸 Screenshots

### 🔹 Frontend
<p align="center">
  <img src="screenshot/frontend1.png" width="30%"/>
  <img src="screenshot/frontend2.png" width="30%"/>
  <img src="screenshot/frontend3.png" width="30%"/>
</p>

### 🔹 Backend
<p align="center">
  <img src="screenshot/backend1.png" width="30%"/>
  <img src="screenshot/backend2.png" width="30%"/>
  <img src="screenshot/backend3.png" width="30%"/>
</p>

---

## 📌 Tech Stack
![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)
![NPM](https://img.shields.io/badge/NPM-CB3837?logo=npm&logoColor=white)
![Rich](https://img.shields.io/badge/Rich-Library-orange)
![Jinja2](https://img.shields.io/badge/Jinja2-Template-red)

---

## 🔮 Future Improvements
- Add role-based authentication
- Integration with external log storage (MongoDB/ElasticSearch)
- Export logs as CSV/JSON
- Dark mode UI
- Add user activity analytics dashboard

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!
1. Fork the repo
2. Create a new branch (`feature-xyz`)
3. Commit your changes (`git commit -m 'Add some Feature'`)
4. Push to the branch (`git push origin feature-xyz`)
5. Open a Pull Request

> 💡 Don’t forget to give the project a ⭐ if you like it!

---

## 📄 License
Distributed under the **MIT License**.
See `LICENSE` for more details.

---

## 📧 Contact
👤 **Author:** [Prasad Sarkate](https://github.com/Prasadsarkate)
📬 Feedbacks, suggestions, and contributions are always welcome!

---

## 📝 Note
> ⚠️ **Disclaimer:** This project is for **learning and development purposes only**.
> Not recommended for production use without proper security improvements.
