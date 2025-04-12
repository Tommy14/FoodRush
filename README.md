# 🍽️ FoodRush - Food Ordering & Delivery System (Microservices Architecture)

Welcome to the official repository of **FoodRush** — a modern, scalable **Food Ordering and Delivery Application** built using **Microservices architecture**.

---

## 🧠 Overview

FoodRush is designed to support:
- Restaurant Management
- Order Handling
- Delivery Coordination
- Customer Interactions

Built with a microservices approach, each service is separated into its own folder for flexibility, scalability, and ease of development.

---

## 🚀 How to Run the Project Locally

Follow these steps to set up the project on your machine:

---

### 📅 Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/FoodRush.git
```

---

### 🧑‍💻 Step 2: Open the Project in VS Code

```bash
cd FoodRush
code .
```

---

### 📂 Step 3: Navigate to the Backend

All services are located inside the `backend/` folder:

```bash
cd backend
```

---

### 🔄 Step 4: Install Dependencies

You must install dependencies for **each service**.

#### Navigate into each service:

```bash
cd service-name
```

Example:

```bash
cd user-service
```

Then run:

```bash
npm install
```

Repeat this step for **every service** inside `backend/`.

---

### 🛠️ Step 5: Configure Environment Variables

There will be a sample environment file in root folder named like:

```
sample env
```

For each service:

1. Open the `sample env` file in the root director.
2. Copy only the **necessary values**.
3. Create a new `.env` file for each service.
4. Paste the copied content into `.env`.

Repeat this for every service.

---

### 🔥 Step 6: Run Each Service

Use a **separate terminal** for each microservice.

To open terminal in VS Code:
- Press <kbd>Ctrl</kbd> + <kbd>`</kbd> (the backtick key)

In each terminal:

```bash
npm run dev
```

This will start each microservice in development mode.

> You should now have all services running in parallel!

---

## ✅ Summary of Commands

```bash
# Clone the repo
git clone https://github.com/your-username/FoodRush.git

# Open in VS Code
cd FoodRush
code .

# Go to backend
cd backend

# For each service:
cd service-name
npm install
# Setup .env
npm run dev
```

---

## 🤝 Contributing

Pull requests are welcome! Please make sure to:
- Create feature branches
- Add clear commit messages
- Keep code modular and readable

---

## 📄 License

This project is licensed under the MIT License.

---

Made with 💛 by Team FoodRush

