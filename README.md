# CampusFind - Campus Lost & Found Intelligence Hub 🔍

> **CS008.23 - Web Applications Development 1**  
> **Instructor:** Mr. Joshua M. Cister  
> **Organization:** UIC-CCS-WEB-DEVELOPMENT-2026-2027  
> **Group Name:** Caban's Group  
> **Team Members:** Caban, Antonio, Khee, Larutin, Villaquer  

---

## 📌 Project Overview
**CampusFind** is a responsive lost-and-found prototype for campus communities. It provides searchable sample listings, browser-local reporting and conversations, and a simulated item recovery flow. Production authentication, shared data, and real-time notifications are outside the scope of Phase 1.

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
* **Data Layer:** Static sample listings in `src/data/items.json`, with browser-only account sign-in, report CRUD, conversations, and report outcomes persisted as JSON in `localStorage`. Users can link a Lost report with another account’s Found report, exchange messages in their dashboards, and mark the linked reports Matched, Claimed, or Delisted. Delisted reports stay in their owners’ dashboards but disappear from public listings. These interactions work only in the same browser and are not delivered to other devices or sent as email. Passwords are PBKDF2-hashed in the browser, but this is prototype authentication only; production authentication and database integration are planned for Phase 2. Sample photos are illustrative stock images with visible source credits.
* **Deployment Pipeline:** Automated CI/CD via Vercel / Netlify linked directly to `main` branch

### Try the browser-only recovery flow
1. Create an account and publish a **Lost** report.
2. Sign out, create a second account in the same browser, and publish a **Found** report with a photo.
3. Browse to the Lost report, choose the Found report you created as the linked report, and send a message.
4. Switch back to the Lost-report owner to reply in **My dashboard → Conversations**. Both participants can continue the conversation and mark the linked reports **Matched**, **Claimed**, or **Delisted**.

This is a local simulation: account switching works in one browser, but messages and report changes do not sync between devices or reach a real backend.

Use the **Report lost item** and **Report found item** actions on the home page or the matching actions in **My dashboard** to create reports. Signed-out users are asked to sign in first, and then continue with the selected report type. The public board can be sorted by report date and filtered to show reports that are still active. The dashboard includes explanations for report statuses.

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
