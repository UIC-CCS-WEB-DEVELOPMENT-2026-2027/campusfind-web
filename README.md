# CampusFind - Campus Lost & Found Intelligence Hub 🔍

> **CS008.23 - Web Applications Development 1**  
> **Instructor:** Mr. Joshua M. Cister  
> **Organization:** UIC-CCS-WEB-DEVELOPMENT-2026-2027  
> **Group Name:** Caban's Group  
> **Team Members:** Caban, Antonio, Khee, Larutin, Villaquer  

---

## 📌 Project Overview
**CampusFind** is an enterprise web application designed to centralize lost-and-found reporting across university buildings and departments. Students, faculty, and campus security staff often struggle with fragmented reporting across Facebook groups, group chats, or physical desks. CampusFind provides a unified, real-time searchable platform for logging lost/found items, verifying ownership claims, and tracking item statuses from report to retrieval.

---

## 🚀 Live Production & Repository Links
* **Live Web App (Vercel):** (https://campusfind-web-swart.vercel.app/)
* **GitHub Repository:** (https://github.com/UIC-CCS-WEB-DEVELOPMENT-2026-2027/campusfind-web)
* **Agile Kanban Board:** (https://github.com/orgs/UIC-CCS-WEB-DEVELOPMENT-2026-2027/projects/10)

---

## 🛠️ Phase 1 Architecture & Tech Stack
During Phase 1 (Web Dev 1), CampusFind is engineered as a responsive Single-Page Application (SPA) driven by client-side state and mock JSON data models.

* **Frontend Framework:** React.js (Bootstrapped with Vite)
* **Styling Framework:** Tailwind CSS / CSS3 (Flexbox & Grid Layouts)
* **Data Layer:** Static sample listings in `src/data/items.json`, with browser-only account sign-in and report CRUD persisted in `localStorage`. Passwords are PBKDF2-hashed in the browser, but this is prototype authentication only; production authentication and database integration are planned for Phase 2. Sample photos are illustrative stock images with visible source credits.
* **Deployment Pipeline:** Automated CI/CD via Vercel / Netlify linked directly to `main` branch

---

## 📅 4-Week Agile Sprint Timeline

### Week 1: Enterprise Setup & Architecture
- [x] Initialized Vite + React repository within the official GitHub Organization.
- [x] Assigned team roles (Frontend, QA/Analyst, Systems Lead).
- [x] Configured continuous integration on Vercel.
- [x] Drafted project proposal document (`WebDev Galaxy Fighters- Proposal.docx`) and core `README.md`.

### Week 2: Component Shells & UI Assembly
- [x] Built core `.jsx` component hierarchy (`Navbar`, `ItemCard`, `ItemGrid`, `SearchFilterBar`).
- [x] Developed responsive dashboard layout with building and category filters.
- [x] Designed visual empty states ("No matching records found") and modal triggers.

### Week 3: State Logic & Usability QA
- [x] Wired client-side search logic (`useState`) to filter mock item data in real time.
- [x] Implemented form validation guard clauses (`.trim()`, `e.preventDefault()`) on item submission and claim modals.
- [x] Added claim status toggles (`Unclaimed` ➔ `Pending` ➔ `Claimed`).

### Week 4: MVP Showcase & Terminal Defense
- [x] Finalized live production build deployment on Vercel.
- [x] Completed Phase 2 Relational Database Pitch & AI Usage Disclosure.
- [x] Conducted 1-on-1 terminal code defense with Mr. Cister.

---

## 🗄️ Phase 2 Pitch: Relational Database & Backend Architecture
In Phase 2 (Web Dev 2), CampusFind will transition from client-side mock data to a full-stack enterprise platform featuring a custom Node.js/Express API server and a MySQL/PostgreSQL relational database.
