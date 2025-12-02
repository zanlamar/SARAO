# SARAO: Event Management Platform

A modern, full-stack event management fun application built with **Angular 20**, **Firebase Authentication**, and **Supabase**. Designed for seamless event scheduling, calendar visualization, and secure user access. 

## 🚀 Live Demo
[Feeling curious? Take a look to the live demo](https://sarao.vercel.app/landing)

---

## 🍏 Key Features

🔐 **User Authentication** — Firebase-based registration and login system

💃 **Event Creation** — Multi-step event creation with location search and image upload

🔗 **Shareable URLs** — Generate and share event invitation links

📝 **Bring Lists** — Collaborative item lists for events

👥 **Guest Management** — Comprehensive invitation, RSVP system and analytics

🗓️ **Calendar View** — Interactive calendar with event visualization

📍 **Location Integration** — Geocoding and map integration for event locations

📈 **Analytics Dashboard** — Event performance metrics and charts

---

## 📂 Project Structure

The project follows a clean **feature-based modular Angular structure**. Core logic and feature modules are organized under src/app, while reusable components and pipes live in shared. Assets are stored in src/assets, and essential configuration files remain at the root of src. This structure keeps the codebase organized, scalable, and easy to navigate.

```
SARAO/

src/
├── app/
│   ├── core/
│   │   ├── features/
│   │   ├── guards/
│   │   ├── helpers-supabase/
│   │   ├── models/
│   │   └── services/
│   ├── shared/
│   │   ├── components/
│   │   └── pipes/
│   ├── app.config.ts
│   ├── app.html
│   ├── app.css
│   ├── app.routes.ts
│   └── app.ts
├── assets/
│   └── images/
├── environments/
├── index.html
├── main.ts
└── styles.css

```

### 🏗️ Architecture Layers

- **Presentation Layer** → User-facing components & screens  
- **Business Logic Layer** → Services handling logic, APIs, and state  
- **Data Layer** → Typed models and interfaces  
- **Shared Layer** → Reusable components, pipes  
- **Routing Layer** → Navigation and route protection  

---

## 👾 Technologies Used

- **Angular 20** - Latest Angular with standalone components
- **RxJS 7.8** - Reactive programming
- **Angular Material 20** - Material Design components
- **PrimeNG 20 & PrimeIcons** -  UI component library
- **Prettier** - Code formatting

- **Firebase Authentication**
- **Supabase** (DB + Storage)
- **Firebase Storage** - File storage solution

- **Chart.js** - Data visualization library
- **Leaflet** - Interactive maps
- **MapLibre GL** - Vector tile rendering
- **Geocoding API** - Address to coordinates conversion


---

## 👩‍💻 Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (v20 or higher)
- Firebase Account (for authentication)
- Supabase Account (for database)

---

## ⚙️ Installation

1. **Install Angular CLI:**

        ```npm install -g @angular/cli``

2. **Clone the repository:**

        git clone [your-repo-url]
        cd SARAO

3. **Install dependencies:**

        npm install

4. **Configure `environment.ts`:**


       // environment.ts

        export const environment = {
        production: false,
        supabase: {
        url: 'YOUR_SUPABASE_URL',
        anonKey: 'YOUR_SUPABASE_ANON_KEY'
        }
        };

        // firebase.config.ts

        export const firebaseConfig = {
        firebaseConfig: {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_AUTH_DOMAIN",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_STORAGE_BUCKET",
        messagingSenderId: "YOUR_SENDER_ID",
        appId: "YOUR_APP_ID"
        }
        };

5. **Database Setup:**

Run the provided SQL scripts in your Supabase dashboard to create the required tables.

6. **Start Development Server:**

        npm start

7. **Build for Production:**

        npm run build

---



