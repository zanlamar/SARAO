# SARAO: Event Management Platform

A modern, full-stack event management FUN application built with **Angular 20**, **Firebase Authentication**, and **Supabase**. Designed for seamless event scheduling, calendar visualization, and secure user access. 

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

This project follows a **feature-based modular structure**, scalable and easy to maintain.

```
SARAO/
├── .angular/                    # Angular CLI cache
├── .vscode/                     # VS Code configuration
├── src/
│   ├── app/
│   │   ├── core/                # Core application logic
│   │   │   ├── guards/          # Route guards
│   │   │   │   └── auth.guard.ts
│   │   │   ├── helpers-supabase/ # Database mappers
│   │   │   │   └── event.mapper.ts
│   │   │   ├── models/          # TypeScript interfaces
│   │   │   │   ├── calendar.model.ts
│   │   │   │   └── event.model.ts
│   │   │   └── services/        # Business logic services
│   │   │       ├── auth.service.ts
│   │   │       ├── calendar.service.ts
│   │   │       ├── event.service.ts
│   │   │       ├── event-data.service.ts
│   │   │       ├── event-stats.service.ts
│   │   │       ├── geocoding.service.ts
│   │   │       ├── invitation.service.ts
│   │   │       ├── shareable-url.service.ts
│   │   │       ├── storage.service.ts
│   │   │       └── supabase.service.ts
│   │   ├── features/            # Feature modules
│   │   │   ├── auth/            # Authentication pages
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── calendar-view/   # Calendar functionality
│   │   │   │   ├── calendar-grid/
│   │   │   │   ├── delete-modal/
│   │   │   │   └── events-list/
│   │   │   ├── event-form/      # Event creation/editing
│   │   │   │   └── location-search/
│   │   │   ├── event-preview/   # Event preview and management
│   │   │   │   └── preview-map/
│   │   │   ├── home/            # Dashboard
│   │   │   ├── landing-page/    # Public landing
│   │   │   ├── memento/         # Analytics dashboard
│   │   │   │   ├── chart-view/
│   │   │   │   └── event-bars/
│   │   │   ├── shareable-url/   # Public event pages
│   │   │   └── user-area/       # User management
│   │   │       ├── table-card/
│   │   │       └── table-view/
│   │   ├── shared/              # Shared components
│   │   │   ├── components/
│   │   │   │   ├── bringlist/
│   │   │   │   ├── footer/
│   │   │   │   └── header/
│   │   │   └── pipes/
│   │   ├── app.config.ts        # App configuration
│   │   ├── app.routes.ts        # Route definitions
│   │   └── app.ts               # Root component
│   ├── assets/                  # Static assets
│   ├── environments/            # Environment configs
│   └── index.html               # Main HTML file
├── angular.json                 # Angular CLI config
├── package.json                 # Dependencies
├── tsconfig.json               # TypeScript config
└── README.md                   # Project documentation

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



