# **🎓 Student Dashboard**

A responsive and feature-rich **React** application for managing student records, with Firebase authentication, protected routes, filtering, searching, and theme toggling. Deployed under `/student-dashboard`.

## 🚀 Features

* 🔐 **Firebase Authentication** with Google Sign-In
  
* 🔒 **Protected Routes** using React Router
  
* 🧾 **Student Management**: Add, Edit, Delete, and View details
  
* 🔍 **Search & Filter** Students by name and course
  
* 🌓 **Light/Dark Theme Toggle** with persistence
  
* 📡 **Mock API Integration** using Axios and Axios Mock Adapter
  
* 💻 **Responsive Design** for mobile and desktop

## 🛠️ Tech Stack

* **Frontend**: React, React Router DOM
  
* **Auth**: Firebase Authentication
  
* **API**: Axios + Axios Mock Adapter
* **Styling**: CSS
  
* **Routing**: React Router with `basename` support
  
* **Hosting**: (Optional) GitHub Pages / Vercel / Firebase Hosting

## 🔧 Installation & Setup

1. **Clone the repository**

   ```bash
   
   git clone https://github.com/your-username/student-dashboard.git
   
   cd student-dashboard
   
   ```

2. **Install dependencies**

   ```bash
   
   npm install
   
   ```

3. **Configure Firebase**

   * Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
     
   * Enable **Google Sign-In** under Authentication
     
   * Replace the Firebase config in `firebase.js`:

     ```js
     
     const firebaseConfig = {
     
       apiKey: "YOUR_API_KEY",
     
       authDomain: "YOUR_AUTH_DOMAIN",
     
       projectId: "YOUR_PROJECT_ID",
     
       // ...
     
     };
     
     ```

4. **Run the app**

   ```bash
   
   npm start
   
   ```

5. Open `http://localhost:3000/`
