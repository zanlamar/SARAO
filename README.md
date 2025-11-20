# SARAO: Event Management Platform

A modern, full-stack event management application built with **Angular 20**, **Firebase Authentication**, and **Supabase**, designed for seamless event scheduling, calendar visualization, and secure user access. This project demonstrates modular architecture, reactive programming with RxJS, and a scalable feature-based structure.

---

## 🍏 Features

- **Event scheduling system** — create, edit, and delete events with real-time database synchronization.
- **Interactive calendar view** — visualize events using a dynamic, user-friendly calendar interface.
- **User authentication** — secure access powered by Firebase.
- **Event previews** — inspect event details before saving or updating.
- **User dashboard** — centralized space for personal events, settings, and quick actions.
- **Responsive UI** — built with PrimeNG and PrimeFlex.
- **Data validation** — strong client-side validation and robust route protection.
- **Lazy loading** — optimized feature loading.
- **Signals-based reactive state** — efficient and predictable UI updates.

---

## 📂 Project Structure

This project follows a **feature-based modular structure**, scalable and easy to maintain.

    src/
    ├── app/
    │   ├── core/
    │   │   ├── guards/            # Route guards for authentication
    │   │   ├── services/          # Core services (auth, events, etc.)
    │   │   └── models/            # Data models and interfaces
    │   │
    │   ├── features/              # Feature modules
    │   │   ├── auth/              # Authentication components
    │   │   ├── calendar-view/     # Calendar visualization
    │   │   ├── event-form/        # Event creation/editing
    │   │   ├── event-preview/     # Event preview functionality
    │   │   ├── home/              # Main dashboard
    │   │   ├── landing-page/      # Public landing page
    │   │   └── user-area/         # User profile and settings
    │   │
    │   ├── shared/                # Shared components and pipes
    │   │   ├── components/        # Reusable UI components
    │   │   └── pipes/             # Custom pipes
    │   │
    │   ├── app.routes.ts          # Application routing
    │   └── app.config.ts          # Application configuration
    │
    ├── assets/                    # Static assets
    │   └── images/                # Image resources
    │
    └── environments/              # Environment configurations

### Architecture Layers

- **Presentation Layer** → User-facing components & screens  
- **Business Logic Layer** → Services handling logic, APIs, and state  
- **Data Layer** → Typed models and interfaces  
- **Shared Layer** → Reusable components, pipes  
- **Routing Layer** → Navigation and route protection  

---

## 👾 Technologies Used

- **Angular 20** (standalone architecture + Signals)
- **Firebase Authentication**
- **Supabase** (DB + Storage)
- **RxJS**
- **PrimeNG & PrimeFlex**
- **SCSS**
- **Angular Router**

---

## 👩‍💻 Prerequisites

- Node.js v18+  
- npm  
- Angular CLI 20+  
- Firebase project  
- Supabase project  

---

## ⚙️ Installation

1. Install Angular CLI:

        npm install -g @angular/cli

2. Clone the repository:

        git clone [your-repo-url]
        cd EntryPoint

3. Install dependencies:

        npm install

4. Configure `environment.ts`:

        export const environment = {
          firebase: {
            apiKey: 'your_firebase_api_key',
            authDomain: 'your_project.firebaseapp.com',
          },
          supabase: {
            url: 'your_supabase_url',
            key: 'your_supabase_key'
          }
        };

5. Run the development server:

        ng serve

6. Open the app:

        http://localhost:4200/

---

## 🔮 Future Improvements

- Advanced calendar filters  
- Multi-user collaboration features  
- Push notifications  
- Analytics dashboard  

