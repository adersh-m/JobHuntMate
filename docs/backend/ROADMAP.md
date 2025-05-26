# 🛣️ JobHuntMate Roadmap

This roadmap outlines the current status, upcoming tasks, and long-term vision for the JobHuntMate project — a personal job application tracker built with Angular + .NET.

---

## ✅ Completed Features

### 🔐 Authentication
- JWT-based auth (login, register, forgot/reset password)
- Claims: email, user ID
- Auth guards, token interceptor
- Mailtrap email integration via SmtpClient

### 📄 Job Management (Backend)
- Job CRUD (create, update, delete)
- Job status tracking
- Dashboard statistics API
- SQLite and SQL Server support
- Swagger UI with token auth
- Exception middleware

### 💻 Job Management (Frontend)
- Angular 16+ + Tailwind CSS
- Lazy-loaded modules: Dashboard, Jobs, Settings
- Responsive layout with mobile support
- Kanban board (drag & drop + dropdowns)
- Table view with inline status updates
- Toggle between board/table view

### 📥 Bulk Import
- Upload `.csv` or `.xlsx` files
- Preview parsed jobs in UI
- Backend import endpoint
- Validation and feedback

---

## 🔜 In Progress / Near-Term Goals (Week 2–3)

### 🔁 Enhanced Job Flow
- [ ] Edit job modal support
- [ ] Add job directly from Kanban
- [ ] Delete confirmation dialog
- [ ] Field-level validations (length, required)

### 📊 Dashboard Expansion
- [ ] Application trends by date
- [ ] Status breakdown chart
- [ ] Recent job activity

### 📤 Export Features
- [ ] Export all jobs as `.csv`
- [ ] PDF summary for each job

### 🔍 Advanced Filtering
- [ ] Filter by status, type, company, date range
- [ ] Save filters for quick access

---

## 🌟 Long-Term Vision

### 💡 Smart Job Assistant
- Public job board scraping (Indeed, LinkedIn)
- Auto-fill company/salary info
- Job matching insights

### 🔐 Security Enhancements
- [ ] Email verification on register
- [ ] Refresh tokens
- [ ] MFA support (2FA)
- [ ] Session expiration/logout handling

### 📱 Mobile & UX
- [ ] Swipe-enabled Kanban
- [ ] Offline mode (PWA)
- [ ] Dark mode

### 🧪 Testing & CI/CD
- [ ] Frontend unit tests (Jest/Karma)
- [ ] Backend integration tests
- [ ] GitHub Actions for CI/CD
- [ ] Preview deploys on PRs

---

## 🧭 Progress Overview

| Track                 | Status         |
|----------------------|----------------|
| Core API             | ✅ Complete     |
| Auth Flow            | ✅ Done         |
| Job UI               | ✅ Done         |
| Import Workflow      | ✅ Done         |
| Export Workflow      | 🔜 Planned      |
| Dashboard Charts     | 🔜 Planned      |
| Mobile Optimization  | 🔜 Planned      |
| Security Hardening   | 🔜 Planned      |
| Testing + CI/CD      | 🟡 Partial      |

---

## 📬 Got Ideas?

Feel free to suggest or contribute by opening an issue or PR. Let's build a smarter job tracking platform together!
