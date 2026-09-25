# DHL-SOP-Ingestion-System
A full-stack 4-Tier Automated SOP Ingestion System built with UiPath RPA, Express API, Vue.js dashboard, and MongoDB.

# DHL SOP Ingestion System (4-Tier Architecture)

An automated, end-to-end Standard Operating Procedure (SOP) ingestion, validation, and monitoring platform built for logistics knowledge base management. The system processes raw SOP documentation via Robotic Process Automation (RPA), transforms and validates payload structures via a central REST gateway, and streams live operational updates to an enterprise administrative portal.

🏗️ System Architecture
The project is structured into four distinct, loosely coupled architectural tiers:

Tier 1: Automation Engine (UiPath RPA)
    - Handles local filesystem directory watching for raw SOP inputs (.txt/.pdf).
    - Automates text extraction, whitespace normalization, and duplicate-screening logic.
    - Dispatches structured JSON payloads to the REST gateway via HTTP POST.

Tier 2: Frontend Client (Vue.js)
    - Serves an interactive operational management UI at http://localhost:8080/.
    - Provides real-time visibility into incoming SOP records, status filters, and global logistics metrics.
    - Features secure user authentication interfaces.

Tier 3: REST API Gateway (Node.js & Express)
    - Runs on http://localhost:3000/api/articles.
    - Handles request validation, routing, error handling, and business logic execution.
    - Facilitates secure database transactions.

Tier 4: Persistence Layer (MongoDB)
    - Database: dhl_ops_db
    - Stores standardized SOP documents, audit logs, and status records in dedicated collections (articles).

🛠️ Tech Stack & Prerequisites
    - Node.js (v16.x or higher)
    - npm (v8.x or higher)
    - MongoDB Community Server (Running locally on default port 27017)
    - Vue CLI (@vue/cli)
    - UiPath Studio Community Edition

📁 
DHL-SOP-Ingestion-System/
├── dhl-backend/               # Tier 3 & Tier 4 (Express & Database integration)
│   ├── models/                # MongoDB Mongoose schemas
│   ├── routes/                # Express API endpoints (/api/articles)
│   ├── .env                   # Environment configurations (ignored in git)
│   ├── package.json           # Node backend dependencies
│   └── server.js              # Server entry point
│
├── dhl-app/                   # Tier 2 (Vue.js Frontend)
│   ├── src/                   # Vue components, views, and assets
│   ├── package.json           # Frontend dependencies
│   └── vue.config.js          # Port & build configuration
│
└── DHL_SOP_Ingestion_Robot/   # Tier 1 (UiPath Workflow)
    ├── Main.xaml              # Primary RPA process sequence
    └── project.json           # UiPath project configuration

 🚀 Getting Started
1. Database Setup
    Ensure your local MongoDB service is active:

    PowerShell
        net start MongoDB
   
3. Backend Setup (dhl-backend)
    Navigate to the backend directory, install dependencies, and start the server:

        cd dhl-backend
        npm install
        node server.js
   
    The backend API will start at http://localhost:3000 and display SUCCESS: Connected cleanly to MongoDB (dhl_ops_db).

3. Frontend Setup (dhl-app)
    Open a new terminal, navigate to the frontend directory, install dependencies, and start the Vue development server:

        cd dhl-app
        npm install
        npm run serve
   
   Access the operational portal in your browser at http://localhost:8080.

4. UiPath Execution (DHL_SOP_Ingestion_Robot)
    1) Open UiPath Studio and load DHL_SOP_Ingestion_Robot.
    2) Ensure Main.xaml points to your active input directory containing sample SOP text files.
    3) Verify the HTTP Request activity endpoint is targeted to http://localhost:3000/api/articles
    4) Click Run or Debug.


🔒 Copyright & License
Copyright (c) 2026 Nur Iman Farisya. All Rights Reserved.
All Rights Reserved. Unauthorized copying, modification, distribution, or commercial use of this software and its associated documentation files via any medium is strictly prohibited without prior written consent from the author.
