# Luxury & Sports Car Gallery (Car Management Web App)

A modern web application built for managing a luxury and sports car gallery, featuring full **CRUD** (Create, Read, Update, Delete) operations.

## 🚀 New Features (Redis Caching)

We have implemented a high-performance Redis caching layer to optimize the API and reduce the load on the primary database (CouchDB).

- **GET Requests:** Responses are cached with a 5-minute Time-To-Live (TTL), reducing response times from ~400ms to ~15ms.
- **Cache Invalidation:** Any data modification (`POST`, `PUT`, `DELETE`) automatically invalidates the relevant cache to ensure data consistency.

## 🛠️ Tech Stack

- **Frontend / Framework:** `Next.js`
- **Styling:** `Tailwind CSS`
- **Database:** `CouchDB`
- **Caching:** `Redis` (via Docker)

## ⚙️ Prerequisites

- `Node.js` (v18 or higher)
- `Docker` (for running CouchDB and Redis)

## 🚀 Installation & Setup

```bash
# Clone the repository
git clone https://github.com/Farah5613/team-farah-naz-mirzaie.git

# Navigate to the project directory
cd team-farah-naz-mirzaie

# Install dependencies
npm install

# Start Database and Redis via Docker
docker compose up -d

# Run the development server
npm run dev
```
