# Kanban Board (Trello Clone)

## Description

This project is a modern Kanban board application inspired by tools like Trello.
It allows users to manage tasks using a drag-and-drop interface across multiple columns.

The application is built with React and TypeScript, focusing on clean architecture, scalability, and a strong user experience.

---

## Features

### MVP

* Create and delete tasks (cards)
* Multiple columns (e.g. Todo, In Progress, Done)
* Drag & Drop between columns
* Responsive UI

### Planned Features

* Edit task details (title, description)
* Reorder tasks within columns
* Local storage persistence
* Multiple boards

### Future Enhancements

* User authentication
* Backend integration (API)
* Realtime updates (WebSockets)

---

## Tech Stack

* React
* TypeScript
* Vite
* Tailwind CSS
* Zustand (state management)
* dnd-kit (drag & drop)

---

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd kanban-board
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run development server

```bash
npm run dev
```

The app will be available at:

```
http://localhost:5173
```

---

## Project Structure

```
src/
 ├── components/   # UI components (Board, Column, Card)
 ├── store/        # Zustand state management
 ├── types/        # TypeScript types
 ├── pages/        # Page components
```

---

## Learning Goals

This project demonstrates:

* Component-based architecture with React
* Type-safe development using TypeScript
* Complex state management
* Drag-and-drop functionality
* Clean and scalable code structure

---

## Status

🚧 Work in progress

---

## Author

Ivo Günther - Fullstack Web Developer