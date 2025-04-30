# JobHuntMate Backend API Specification

## Base URL
```
http://localhost:8080/api/v1
```

## Models

### Job
```typescript
{
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary?: string;
  jobType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
  status: 'WISHLIST' | 'APPLIED' | 'INTERVIEWING' | 'OFFERED' | 'REJECTED';
  applicationDate: Date;
  lastUpdateDate: Date;
  notes?: string;
  url?: string;
  contactPerson?: {
    name: string;
    email?: string;
    phone?: string;
    position?: string;
  };
  interviews?: [{
    date: Date;
    type: 'PHONE' | 'VIDEO' | 'ONSITE' | 'TECHNICAL' | 'OTHER';
    notes?: string;
    status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  }];
  tags?: string[];
}
```

### User
```typescript
{
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  settings: {
    theme: 'LIGHT' | 'DARK';
    emailNotifications: boolean;
    defaultJobView: 'LIST' | 'KANBAN';
  }
}
```

## API Endpoints

### Authentication
- POST `/auth/register`
  - Register a new user
  - Body: `{ email, password, firstName, lastName }`
  - Returns: User object with token

- POST `/auth/login`
  - Login user
  - Body: `{ email, password }`
  - Returns: User object with token

### Jobs
- GET `/jobs`
  - Get all jobs for authenticated user
  - Query params: 
    - status?: JobStatus
    - search?: string
    - sort?: 'applicationDate' | 'lastUpdateDate' | 'company' | 'title'
    - order?: 'asc' | 'desc'
    - page?: number
    - limit?: number
  - Returns: `{ jobs: Job[], total: number }`

- POST `/jobs`
  - Create new job
  - Body: Job object (without id)
  - Returns: Created job

- GET `/jobs/{id}`
  - Get job by ID
  - Returns: Job object

- PUT `/jobs/{id}`
  - Update job
  - Body: Job object
  - Returns: Updated job

- DELETE `/jobs/{id}`
  - Delete job
  - Returns: 200 OK

### User Settings
- GET `/users/me`
  - Get current user profile
  - Returns: User object

- PUT `/users/me`
  - Update user profile
  - Body: User object
  - Returns: Updated user object

- PUT `/users/me/settings`
  - Update user settings
  - Body: Settings object
  - Returns: Updated settings

### Statistics
- GET `/stats/overview`
  - Get job application statistics
  - Returns: 
    ```typescript
    {
      totalApplications: number;
      byStatus: {
        [status: string]: number;
      };
      byCompany: {
        [company: string]: number;
      };
      applicationTrends: {
        date: string;
        count: number;
      }[];
    }
    ```

## Error Responses
```typescript
{
  status: number;
  message: string;
  errors?: {
    [field: string]: string;
  };
}
```

## Authentication
All endpoints except `/auth/login` and `/auth/register` require authentication using Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

## Rate Limiting
- 100 requests per minute per IP
- 1000 requests per hour per user

## Data Validation
- All string fields have a maximum length of 255 characters unless specified otherwise
- Description and notes fields have a maximum length of 2000 characters
- URLs must be valid and have a maximum length of 500 characters
- Dates must be in ISO 8601 format