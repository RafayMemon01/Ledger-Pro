# 📒 Ledger Management System (React + Firebase + Zustand + Tailwind)

A modern, fast, and secure Ledger Management SaaS application built with **React.js**, **Firebase** (Authentication & Firestore), **Zustand** for state management, and **Tailwind CSS** for styling.

This app allows each authenticated user to:
- Create multiple ledgers.
- Add credit and debit transactions.
- View and manage transaction history in real-time.
- Securely store data in Firestore with user-level access control.

---

## 🚀 Features

- **Authentication**  
  Sign up, log in, and log out using Firebase Authentication.

- **Ledger Management**  
  Create, edit, and delete ledgers. Each user can have multiple ledgers.

- **Transaction Management**  
  Add, update, and delete transactions (`credit` or `debit`) with notes, dates, and amounts.

- **Real-Time Updates**  
  Firestore listeners (`onSnapshot`) keep your data in sync instantly.

- **Secure Access Control**  
  Firebase security rules ensure only the owner can access their data.

- **Responsive UI**  
  Styled with the latest Tailwind CSS for a clean and modern look.

---

## 🛠 Tech Stack

- **Frontend**: [React.js](https://react.dev/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Database & Auth**: [Firebase](https://firebase.google.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Routing**: [React Router](https://reactrouter.com/)