![MIT License](https://img.shields.io/badge/license-MIT-green)

# E-Commerce Microservices Architecture 

This project is a **production-grade E-Commerce backend** built using a **microservices architecture**. It leverages **Node.js**, **Express**, **MongoDB**, and **RabbitMQ** for asynchronous, event-driven communication between services.

## Architecture Overview

The platform is split into independent, decoupled services, each responsible for a single domain:

* **User Service** – Handles user registration, login, authentication (JWT), and profile management.
* **Product Service** – Manages product creation, updates, listings, and stock control.
* **Cart Service** – Lets users add, update, or remove items from their cart.
* **Order Service** – Creates and tracks orders.
* **Payment Service** – Simulates payment processing and triggers related events.

These services communicate through **RabbitMQ** for seamless and scalable inter-service messaging.

## Tech Stack

* **Backend Framework:** Node.js + Express
* **Database:** MongoDB
* **Authentication:** JWT (JSON Web Tokens)
* **Message Broker:** RabbitMQ
* **Architecture:** Microservices
* **Logging:** Winston logger
* **Cloudinary:** For profile picture uploads

## Event-Driven Communication

Each service is event-aware and reacts to events using RabbitMQ queues:

* `ORDER_CREATED` ➝ Triggered by Order Service ➝ Consumed by Payment Service
* `PAYMENT_SUCCESS` or `PAYMENT_FAILED` ➝ Triggered by Payment Service ➝ Consumed by Product and Order Services

## Microservices Responsibilities

### User Service

* Register / Login users
* JWT-based authentication middleware
* Upload and store user profile pictures (via Cloudinary)

### Product Service

* Create / update / delete products (authorization required)
* Fetch product listings
* Listen to successful payments and update stock accordingly

### Cart Service

* Add products to cart
* Update and remove items
* Clear cart after successful payment

### Order Service

* Create and retrieve orders
* Restrict order access to owners or admin
* Listen to payment events to update order status

### 💳 Payment Service

* Simulate payments
* Emit payment result events
* Allow users to view payment history

## ✅ Key Features

* Fully **event-driven communication** using RabbitMQ
* Services are **loosely coupled** and independently scalable
* Uses **MongoDB** for persistence in each service
* Role-based **authorization** (admin/user)
* Supports **secure file uploads** for user avatars

## Getting Started

### Prerequisites

* Node.js
* MongoDB
* RabbitMQ
* Cloudinary account (for profile pictures)

### Environment Variables

Each service has its own `.env` file. Ensure you configure:

* `PORT`
* `JWT_SECRET`
* `MONGO_URI`
* `RABBITMQ_URL`
* `CLOUDINARY_API_KEY`, `CLOUDINARY_SECRET`, etc. (for User Service)

### Installation & Running

Clone the repository and install dependencies in each service folder:

```bash
cd user-service
npm install
npm run dev

cd product-service
npm install
npm run dev

# ...repeat for other services
```

RabbitMQ and MongoDB should be running locally or via Docker.

## Project Structure (Example for a Service)

```
user-service/
├── controllers/
├── routes/
├── services/
├── models/
├── middleware/
├── rabbitmq/
├── config/
├── app.ts
└── server.ts
```

## Sample Event Flow

```
User ➝ Creates Order
  ➝ ORDER_CREATED Event ➝ Payment Service
    ➝ PAYMENT_SUCCESS Event ➝ Order + Product Service
      ➝ Order updated, product stock reduced
```

## Future Improvements

* Dockerize each service
* Add API Gateway
* Add rate limiting and monitoring
* Add Swagger API documentation

## Acknowledgements

Built as a personal project to demonstrate deep understanding of microservices and asynchronous architecture.


### License

This project is licensed under the MIT License
