# URL Shortener API

A simple URL shortener built with Node.js, Express, and SQLite.
Send a long URL and get back a short one. That's it.

## Tech Stack
- Node.js
- Express.js
- SQLite3
- CORS

## API Endpoints

| Method | Endpoint      | Description          |
|--------|--------------|----------------------|
| POST   | /shorten      | Shorten a long URL   |
| GET    | /:code        | Redirect to long URL |
| GET    | /urls         | Get all saved URLs   |

## How to Run

cd backend
npm install
node server.js

Server runs on http://localhost:4000

## Example

POST /shorten
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}

Response:
{
  "shortCode": "ab3x9f",
  "shortUrl": "http://localhost:4000/ab3x9f"
}
