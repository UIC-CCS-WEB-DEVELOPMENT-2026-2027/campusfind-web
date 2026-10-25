# CampusFind

**Campus Lost and Found Platform**

[**Live Demo: View CampusFind on Vercel**](https://campusfind-web-swart.vercel.app/)

> **AI Disclosure:** Parts of this project's codebase and README documentation were developed with the assistance of Artificial Intelligence tools. AI was used to support development, code generation, UI/UX design, debugging, and documentation. The final implementation and project decisions remain subject to the team's review and verification.

---

## Overview

CampusFind addresses a common problem in university life: **reconnecting people with their lost belongings**. Students and faculty may struggle to find missing items or return found belongings when reports are scattered across social media posts, group chats, and physical lost-and-found desks.

CampusFind provides a centralized platform where campus community members can browse lost and found reports, search by keywords, filter listings by category and location, and submit reports about lost or found items. Users can view item details and use the platform's contact request workflow to help coordinate the return of belongings.

The project aims to make campus lost-and-found reporting more organized, accessible, and convenient while encouraging users to verify ownership before returning an item.

### The Team

### The Team

- Caban
- Antonio
- Khee
- Larutin
- Villaquer

---

## Key Features

### Lost and Found Listings

- **Browse Item Reports:** View reported lost and found belongings on the campus board.
- **Keyword Search:** Search for items using their names, categories, locations, or descriptions.
- **Category and Location Filters:** Narrow down listings to find relevant reports more easily.
- **Date Range Filtering:** Filter reports by age, including reports from the past week, two weeks, three weeks, one month, or older.
- **Item Details:** Open individual reports to view additional information about an item.
- **Pagination:** Browse listings in manageable groups rather than displaying every item on one page.

### Reporting and Contact Workflow

- **Lost Item Reporting:** Submit a report for an item that has gone missing.
- **Found Item Reporting:** Submit a report for an item found on campus.
- **Report Management:** Signed-in users can access their dashboard to manage their reports.
- **Contact Requests:** Use the contact request workflow to coordinate with the person associated with a report.
- **Report Status Tracking:** Display relevant statuses to help users understand the progress of a report.

### User Interface and Accessibility

- **Responsive Interface:** Organizes the dashboard, search tools, listings, and report forms into a consistent interface.
- **Status Indicators:** Distinguishes lost and found items and displays applicable report statuses.
- **Empty Search State:** Provides feedback when no reports match the current search or filters.
- **Filter Reset:** Allows users to clear filters and return to the full set of listings.

---

## Tech Stack and Design System

- **Frontend Framework:** React.js
- **Development and Build Tool:** Vite
- **Programming Language:** JavaScript (JSX)
- **Styling:** CSS
- **Data Storage:** Browser `localStorage` for supported user-generated data and report persistence.
- **Sample Data:** JSON-based item records used to demonstrate the lost-and-found listing interface.
- **Version Control:** Git and GitHub
- **Deployment:** Vercel

### Design Approach

CampusFind uses a component-based design to organize the interface and make individual features easier to maintain.

- **Navigation:** Provides access to the main areas of the application.
- **Dashboard:** Displays the campus board, search bar, filters, item cards, and pagination.
- **Reusable Components:** Separates features such as item details, report forms, and date filtering into individual components.
- **Consistent Styling:** Uses shared CSS and component-specific styles to maintain a consistent visual experience.

---

## Project Structure

The project uses a component-based folder structure to separate the main application, reusable interface components, sample data, and styling.

```text
src/
├── assets/                 # Images and other static assets
├── components/
│   ├── Navbar.jsx          # Main navigation
│   ├── Footer.jsx          # Page footer
│   ├── Dashboard.jsx       # Main lost-and-found board
│   ├── UserDashboard.jsx   # User report dashboard
│   ├── LoginForm.jsx       # Login interface
│   ├── ReportForm.jsx      # Lost/found report form
│   ├── ItemDetails.jsx     # Individual item details
│   ├── DateSorting.jsx     # Date range filter
│   └── *.css               # Component stylesheets
├── data/
│   └── items.json          # Sample item listings
├── App.jsx                 # Main application and page rendering
├── App.css                 # Application-level styles
└── main.jsx                # React entry point
```

*Note: This structure highlights the main files and components. Refer to the repository for the complete and current project structure.*

---

## Data Management

CampusFind uses browser-based storage for supported user-generated data in its current prototype implementation.

- **Sample Listings:** Initial item reports are provided through the project's JSON sample data.
- **Local Persistence:** Supported user-generated reports and related information can be saved in the browser's `localStorage`.
- **Page Refreshes:** Data saved in `localStorage` can persist when the page is refreshed in the same browser.
- **Browser-Specific Storage:** Locally saved data is not automatically synchronized across different browsers or devices.

> **Note on Data Storage:** CampusFind is a prototype intended for demonstration and educational purposes. It does not currently provide a centralized backend database or guarantee real-time synchronization between users and devices. Reports, conversations, and other user-generated data saved in browser storage may only be available in the browser where they were created. Clearing browser data, manually clearing `localStorage`, or using a different browser or device may cause locally stored information to become unavailable or be lost. Sample reports are for demonstration and should not be treated as verified real-world lost-and-found records. Users should independently verify an item's ownership before arranging its return. Do not rely on CampusFind as the sole record of an important report or as a guarantee that an item will be recovered.

---

## Project Scope and Future Development

The current version demonstrates the core user interface and lost-and-found reporting workflow. Additional development may be needed before the platform can be used as a fully operational campus-wide service.

Potential improvements include:

- **Centralized Backend Database:** Store reports and user data in a shared database accessible to authorized users.
- **Real Authentication:** Implement secure, production-ready account authentication and authorization.
- **Cross-Device Synchronization:** Allow reports and status updates to remain consistent across devices.
- **Notifications:** Notify users about relevant contact requests and report updates.
- **Administrative Tools:** Provide authorized campus personnel with tools to moderate reports and manage the lost-and-found process.
- **Enhanced Verification:** Introduce stronger procedures for verifying ownership and preventing fraudulent claims.

---

## Disclaimer

CampusFind is an academic prototype and is not an official university lost-and-found service unless formally adopted by the institution. The application is provided for demonstration and educational purposes. Listing information may be incomplete, outdated, or unverified. Users are responsible for exercising caution when communicating with others and arranging item returns. Do not publish passwords, sensitive personal information, or confidential details in reports or messages.

The development team does not guarantee that listed items will be found, returned, or successfully claimed. Any future production deployment should include appropriate security, privacy, data protection, and verification measures.
