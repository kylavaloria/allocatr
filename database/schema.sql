-- Resources Table
CREATE TABLE Resources (
    ResourceID INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Unit NVARCHAR(100),
    Role NVARCHAR(100),
    CapacityPerWeek DECIMAL(5,2),
    RateCard DECIMAL(10,2),
    Generalization NVARCHAR(100),
    Specialization NVARCHAR(100),
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE()
);

-- Tasks Table
CREATE TABLE Tasks (
    TaskID INT IDENTITY(1,1) PRIMARY KEY,
    ResourceID INT NOT NULL,
    TaskName NVARCHAR(200) NOT NULL,
    TaskType NVARCHAR(50) CHECK (TaskType IN ('Admin', 'Community', 'Learning', 'Managed Services', 'Mentoring', 'Others', 'Pre-sales', 'Program', 'Project')),
    TaskStatus NVARCHAR(50) CHECK (TaskStatus IN ('Done', 'Future Work', 'Leave', 'Ongoing', 'Paused')),
    StartDate DATE,
    EndDate DATE,
    TaskAllocationHours DECIMAL(5,2),
    Billable BIT DEFAULT 0,
    IsVisible BIT DEFAULT 1,
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (ResourceID) REFERENCES Resources(ResourceID) ON DELETE CASCADE
);

-- Holidays Table
CREATE TABLE Holidays (
    HolidayID INT IDENTITY(1,1) PRIMARY KEY,
    HolidayDate DATE NOT NULL UNIQUE,
    Description NVARCHAR(200),
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- Indexes for performance
CREATE INDEX IDX_Tasks_ResourceID ON Tasks(ResourceID);
CREATE INDEX IDX_Tasks_Status ON Tasks(TaskStatus);
CREATE INDEX IDX_Tasks_Dates ON Tasks(StartDate, EndDate);
CREATE INDEX IDX_Holidays_Date ON Holidays(HolidayDate);
```

### 5. Git Setup

Create `.gitignore` in root:
```
# Dependencies
node_modules/
client/node_modules/
server/node_modules/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Production build
client/build/
dist/

# Logs
*.log
npm-debug.log*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
