# OptiMind ERP System

A comprehensive Enterprise Resource Planning system with role-based access control, department management, and multi-language support.

## Features

- **Role-Based Access Control (RBAC)**: Secure access management with multiple user roles
- **Department Management**: Organize users and resources by department
- **Leave Management**: Request and approve leave applications
- **ChatBot Assistant**: AI-powered help and guidance
- **Real-time Notifications**: Stay updated with system events
- **Multi-language Support**: English, Chinese, and Bahasa Malaysia

## Internationalization (i18n)

This project supports three languages:
- English (default)
- Simplified Chinese (简体中文)
- Bahasa Malaysia

Users can switch languages using the globe icon in the top navigation bar.

For developer documentation, see [i18n Usage Guide](docs/i18n-usage-guide.md).

## 📚 Documentation

**[Complete Documentation Index](DOCS-INDEX.md)** - Navigate all project documentation organized by category.

## Quick Start

### Prerequisites

- Node.js 16+ and npm
- PostgreSQL 12+
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd FYP-MoeyChingWei
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. Configure environment variables:
```bash
# Backend (.env)
cp backend/.env.example backend/.env
# Edit backend/.env with your database credentials

# Frontend (.env)
cp client/.env.example client/.env
# Edit client/.env with your API endpoints
```

4. Run database migrations:
```bash
cd backend
npm run migrate
```

5. Start the application:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

## Documentation

- **[Documentation Index](DOCS-INDEX.md)**: Complete documentation navigation
- **[Project Log](PROJECT-LOG.md)**: Development history and troubleshooting
- **[Complete Documentation](docs/01-core/DOCUMENTATION.md)**: Full system documentation
- **[Quick Start Guide](docs/02-setup-guides/QUICK-START.md)**: Fast setup for development
- **[Backend Setup](docs/02-setup-guides/backend/README.md)**: Backend API and setup
- **[Frontend Setup](docs/02-setup-guides/frontend/README.md)**: Frontend components and setup

For document navigation in Chinese, see [docs/01-core/README-DOCS.md](docs/01-core/README-DOCS.md).

## Technology Stack

### Frontend
- React 18
- TypeScript
- Material-UI
- i18next (internationalization)
- React Router
- Axios

### Backend
- Node.js
- Express
- PostgreSQL
- Sequelize ORM
- JWT Authentication

## Project Structure

```
FYP-MoeyChingWei/
├── backend/          # Backend API server
├── client/           # React frontend
├── docs/             # Documentation
├── Diagram/          # System diagrams
└── scripts/          # Utility scripts
```

## Contributing

1. Check existing issues or create a new one
2. Create a feature branch
3. Make your changes
4. Write or update tests
5. Update documentation
6. Submit a pull request

## License

This project is developed as a Final Year Project (FYP).

## Support

For questions or issues:
1. Check [PROJECT-LOG.md](PROJECT-LOG.md) for common issues
2. Review [docs/01-core/DOCUMENTATION.md](docs/01-core/DOCUMENTATION.md) troubleshooting section
3. Create an issue in the repository

---

**Last Updated**: 2026-06-16
