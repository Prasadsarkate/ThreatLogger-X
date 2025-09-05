# ⚡ ThreatLogger X

ThreatLogger X is a **full-stack security logging and monitoring tool** built with **FastAPI (backend)** and **React (frontend)**.  
It helps developers and security teams to log, track, and visualize potential threats in real time with a clean and user-friendly dashboard.

---

## 📖 About

Cyber threats are increasing rapidly, and monitoring logs effectively is crucial for security.  
**ThreatLogger X** provides a simple yet powerful interface to record and monitor logs, making it easier to identify and respond to suspicious activities.  

---

## 🚀 Features
- 🔐 **Secure Login System** (Default credentials included)  
- ⚡ **FastAPI Backend** – high-performance and scalable  
- 🎨 **React Frontend** – modern and responsive UI  
- 📊 **Real-time Logging Dashboard**  
- 📝 **History & Log Tracking**  
- 🖼️ **Screenshots Included for Quick Preview**  

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
uvicorn main:app --reload
```

👉 Server will start at: [http://127.0.0.1:8000](http://127.0.0.1:8000)

---

### 🔹 2. Frontend (React)
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm install react-scripts@5.0.1
npm start
```

👉 App will run at: [http://localhost:3000](http://localhost:3000)

---

## 🔑 Default Login Credentials
Use the following credentials to log in:

- **Username:** `admin`  
- **Password:** `admin123`  

---

## 📸 Screenshots

### 🔹 Frontend
<p align="center">
  <img src="screenshot/frontend/frontend1.png" width="30%"/>
  <img src="screenshot/frontend/frontend2.png" width="30%"/>
  <img src="screenshot/frontend/frontend3.png" width="30%"/>
</p>

### 🔹 Backend
<p align="center">
  <img src="screenshot/backend/backend1.png" width="45%"/>
  <img src="screenshot/backend/backend2.png" width="45%"/>
</p>
<p align="center">
  <img src="screenshot/backend/backend3.png" width="90%"/>
</p>

---

## 📌 Tech Stack
- **Backend:** Python, FastAPI, Uvicorn  
- **Frontend:** React, JavaScript  
- **Other Tools:** Jinja2, Rich, Node.js, NPM  

---

## 📧 Contact
👤 **Author:** [Prasad Sarkate](https://github.com/Prasadsarkate)  
📬 Feel free to reach out for feedback or collaboration!  

---

## 📝 Note
⚠️ This project is built for **learning and development purposes**.  
It is not intended for production use without proper security enhancements.  
