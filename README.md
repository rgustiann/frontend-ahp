# 📦 AHP Supplier Selection Frontend

A web-based frontend application for supplier selection using the **Analytical Hierarchy Process (AHP)** method.  
This system helps organizations evaluate, rank, and automatically allocate supply to suppliers based on AHP recommendations.  
It provides two main interfaces: **Admin** and **Manager**

<img width="1836" height="961" alt="image" src="https://github.com/user-attachments/assets/f62fd056-86ca-4248-b4ad-bbe8ac2fb8ba" />


---

## ✨ Features

### 🔐 Authentication
- User registration and login
- Role-based access control (Admin / Manager)

### 📋 Supplier Management
- CRUD operations for suppliers
- Auto allocation of supply based on AHP recommendations

### ⚙️ Criteria Management
- CRUD operations for evaluation criteria

### 📊 AHP Processing
- Perform pairwise comparison of criteria
- Calculate weights and priorities
- Generate supplier ranking

### 📝 Reporting
- Generate and view reports for supplier evaluations and allocations

### 🖥️ Role-based Dashboards
- **Admin:** Manage suppliers, criteria, and system configuration
- **Manager:** View recommendations, approve allocations, and access reports

---

## 🛠 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **HTTP Client:** [Axios](https://axios-http.com/)
- **State Management:** Custom Context API implementation
- **Routing:** Built-in Next.js routing
- **API Integration:** REST API from backend service

---
---

## 🚀 Getting Started

### 1 Clone the repository
```bash
git clone https://github.com/rgustiann/frontend-website-ahp.git
cd frontend-website-ahp
```
### 2 Install dependencies
```bash
npm install
```
### 3️ Configure environment variables
Create a .env.local file in the project root and set the backend API URL:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```
### 4️ Run the development server
```
npm run dev
```
### Open http://localhost:3000 in your browser.
---

## 🔗 Backend Requirement
This frontend requires the AHP Supplier Selection backend API to be running.
Make sure the backend service is started and accessible via the NEXT_PUBLIC_API_URL you configured.

## 💡 Contribution
Contributions are welcome!
Feel free to fork this repository, submit pull requests, or open issues for discussion.
