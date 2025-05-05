# 🧾 JobHuntMate

**JobHuntMate** is a web application to help job seekers organize and track their job applications efficiently. Built with **.NET Core (backend)** and **Angular (frontend)**, it focuses on simplicity, clarity, and real-world usability.

---

## 🎯 Features (Planned)

- **Job Tracking**: Add and manage job applications with details like company, position, status, and more.
- **Status Management**: Update application statuses (e.g., Wishlist, Applied, Interviewing, Offered, Rejected).
- **Responsive UI**: User-friendly interface built with Angular.
- **RESTful API**: Backend powered by ASP.NET Core Web API.
- **Data Persistence**: Uses Entity Framework Core with a SQL Server database.
- **Testing**: Comprehensive unit tests using xUnit and Moq.
- **Continuous Integration**: Automated builds and tests via GitHub Actions.

---

## 🛠️ Tech Stack

| Layer       | Technology                   |
|-------------|------------------------------|
| Frontend    | Angular 15+, TypeScript, Webpack        |
| Backend     | .NET Core Web API, C#, Entity Framework Core  |
| Database    | SQL Server / SQLite  |
| Testing     | xUnit, Moq  |
| Auth (future)| JWT or Identity   |
| CI/CD       | GitHub Actions   |

---

## 📁 Project Structure

```
JobHuntMate/
├── .github/workflows/       # CI/CD workflows
├── JobHuntMate.Api/         # ASP.NET Core Web API backend
├── frontend/job-hunt-mate/  # Angular frontend application
├── JobHuntMate.Api.Tests/   # Backend unit tests
├── docs/                    # Planning docs, notes, screenshots
└── README.md                # Project documentation
```

---

## 🔧 Setup Instructions

### Prerequisites

* [.NET 6 SDK](https://dotnet.microsoft.com/download/dotnet/6.0)
* [Node.js (v18.x or higher)](https://nodejs.org/)
* [Angular CLI](https://angular.dev/tools/cli)
* [SQL Server](https://www.microsoft.com/en-us/sql-server)

### Backend Setup

1. Navigate to the backend project directory:

       cd JobHuntMate/JobHuntMate.Api

2.  Restore dependencies:
    
        dotnet restore

3.  Apply database migrations:

        dotnet ef database update

4.  Run the API:

        dotnet run  

### Frontend Setup

1. Navigate to the frontend project directory:

        cd JobHuntMate/frontend/job-hunt-mate

2.  Install dependencies:

        npm install

3.  Build the application:

        npx webpack
        
4.  Serve the application:

        npm start

## ✅ Running Tests

### Backend Tests

1.  Navigate to the test project directory:

        cd JobHuntMate/JobHuntMate.Api.Tests
        
2.  Run the tests:

        dotnet test

### Frontend Tests

_Note: Frontend testing setup is pending. Contributions are welcome!_

## 🔄 Continuous Integration

The project utilizes GitHub Actions for continuous integration. The workflow is defined in `.github/workflows/webpack.yml` and is triggered on pushes and pull requests to the `master` branch. It performs the following steps:

*   Checks out the repository
*   Sets up Node.js
*   Installs dependencies
*   Builds the frontend using Webpack

---

## 🚀 Project Goals

This project is part of my personal portfolio to:
- Practice building real-world apps end-to-end
- Share my learning and growth in public
- Improve my consistency and documentation skills

---

## 📌 Current Status

🔸 Planning phase  
🔸 Setting up project structure  
🔸 Backend & frontend to be scaffolded next

---

## 🧠 Learn Along

I’ll also be sharing my experience and dev notes on [Medium](https://medium.com/@adersh.008) as I go.

---

## 🤝 Contribute / Feedback

This is an open learning journey. If you have ideas or just want to connect, feel free to open an issue or reach out!
