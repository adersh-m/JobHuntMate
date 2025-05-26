# 🧾 JobHuntMate

JobHuntMate is a web application to help job seekers organize and track their job applications efficiently. Built with **.NET Core (backend)** and **Angular (frontend)**, it focuses on simplicity, clarity, and real-world usability.

## 🎯 Key Features

### Privacy-First Architecture
- CSRF protection
- XSS prevention
- Content Security Policy
- Strict Transport Security

### Enhanced User Experience
- Real-time status updates
- Intuitive notification system
- Smart activity timeline
- Responsive design

## 🛠️ Technical Stack

| Layer       | Technology                   |
|-------------|------------------------------|
| Frontend    | Angular 18, TypeScript 5.x, RxJS 7.x |
| Backend     | .NET Core 6, Entity Framework Core |
| Database    | SQL Server / SQLite |
| Testing     | xUnit, Moq |
| Auth        | JWT |
| CI/CD       | GitHub Actions |

## 📁 Project Structure
```
JobHuntMate/
├── .github/workflows/       # CI/CD workflows
├── JobHuntMate.Api/        # ASP.NET Core Web API backend
├── frontend/job-hunt-mate/ # Angular frontend application
├── JobHuntMate.Api.Tests/  # Backend unit tests
├── docs/                   # Planning docs, notes, screenshots
└── README.md              # Project documentation
```

## 🚀 Getting Started

### Prerequisites
* [.NET 6 SDK](https://dotnet.microsoft.com/download/dotnet/6.0)
* [Node.js (v18.x or higher)](https://nodejs.org/)
* [Angular CLI](https://angular.dev/tools/cli)
* [SQL Server](https://www.microsoft.com/en-us/sql-server)

### Backend Setup
```sh
cd JobHuntMate/JobHuntMate.Api
dotnet restore
dotnet ef database update
dotnet run
```

### Frontend Setup
```sh
cd JobHuntMate/frontend/job-hunt-mate
npm install
npm start
```

## 🧪 Running Tests

### Backend Tests
```sh
cd JobHuntMate/JobHuntMate.Api.Tests
dotnet test
```

### Frontend Tests
Frontend testing setup is pending. Contributions are welcome!

## 🔄 Development Status

### Completed
- ✅ Core API
- ✅ Authentication Flow
- ✅ Job UI
- ✅ Import Workflow

### In Progress
- 🔜 Export Workflow
- 🔜 Dashboard Charts
- 🔜 Mobile Optimization
- 🔜 Security Hardening

## 🤝 Contributing

This is an open learning journey. If you have ideas or want to contribute, feel free to:
1. Open an issue
2. Submit a pull request
3. Share feedback

## 📝 License

This project is open source and available under the MIT License.

## 🧠 Learn More

Follow the development journey and technical insights on [Medium](https://medium.com/@adersh.008).