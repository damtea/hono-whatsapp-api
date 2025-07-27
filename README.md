# WhatsApp API Service

A simple API service for sending WhatsApp template messages and handling webhook events using [Hono](https://hono.dev/) and Bun.

## Features

- Send WhatsApp template messages via the Meta Graph API
- Webhook endpoint for WhatsApp status updates
- Input validation with Zod
- CORS and logging middleware
- Written in TypeScript, runs on Bun

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed
- WhatsApp Business API credentials (see `.env`)

### Installation

Install dependencies:

```sh
bun install
```

### Configuration

Create a `.env` file in the project root with the following variables:

```
WA_ACCESS_TOKEN=your_access_token
WA_PHONE_NUMBER_ID=your_phone_number_id
WA_EXAMPLE_TEMPLATE=your_template_name
WA_WEBHOOK_VERIFY_TOKEN=your_webhook_verify_token
```

### Running the Server

Start the development server:

```sh
bun run dev
```

The server will run on [http://localhost:4000](http://localhost:4000) by default.

## API Endpoints

### POST `/api/send-message`

Send a WhatsApp template message.

**Request Body:**

```json
{
  "mobile_number": "1234567890"
}
```

**Response:**

- `200 OK` on success
- `400 Bad Request` on error

### GET `/api/wa-webhook`

Webhook verification endpoint for Facebook.

### POST `/api/wa-webhook`

Receives webhook events from WhatsApp.

## Project Structure

```
src/
  app.ts          # Hono app and route definitions
  index.ts        # Server entry point
  types/
    index.ts      # TypeScript types for WhatsApp API
```
