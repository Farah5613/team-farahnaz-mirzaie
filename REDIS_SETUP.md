Redis Caching Implementation

Overview

This document explains the Redis caching layer added to the Cars API to reduce the load on the primary database (CouchDB) and improve response times.

Why Redis?

Fetching data from CouchDB takes ~400ms. By caching the response in Redis, subsequent requests for the same data take only ~15ms (a ~28x speed improvement). This prevents database bottlenecks as the app scales.

Setup & Prerequisites

1. Start Services (Docker):
   Redis has been added to docker-compose.yml. Ensure Docker is running and start the services:
   ```bash
   docker compose up -d
   ```
2. Install Dependencies:
   The ioredis package is required:
   ```bash
   npm install
   ```
3. Environment Variables:
   Add the Redis URL to your .env file:
   ```env
   REDIS_URL="redis://localhost:6379"
   ```

How It Works

· Redis Client (lib/redis.ts): Uses ioredis attached to a global object to prevent multiple connections during Next.js hot-reloading.
· GET Requests (Caching): Generates a unique key (e.g., cars:page:1:limit:10). If the key exists in Redis (Cache Hit), it returns instantly. If not (Cache Miss), it fetches from CouchDB and saves to Redis with a 5-minute TTL.
· POST/PUT/DELETE (Cache Invalidation): After any data modification, the API searches for all cars:page:* keys and deletes them to ensure the next GET request fetches fresh data.

How to Test

1. Clear the cache:
   ```bash
   docker exec -it redis redis-cli FLUSHALL
   ```
2. Request: http://localhost:3000/api/cars?page=1&limit=10
   · First request: ❌ [CACHE MISS] (Slower)
   · Second request (Refresh): ✅ [CACHE HIT] (Much faster)