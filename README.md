# Future Franchise Owners

> A comprehensive franchise discovery platform connecting aspiring entrepreneurs with franchise opportunities.

[![Next.js](https://img.shields.io/badge/Next.js-15.4.4-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.13-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Payload CMS](https://img.shields.io/badge/Payload-3.56.0-000000?style=flat-square)](https://payloadcms.com/)

---

## 🎯 Project Overview

Future Franchise Owners is a modern web platform designed to help aspiring entrepreneurs discover, evaluate, and connect with franchise opportunities. The platform features a comprehensive franchise directory, educational content, and tools to match users with suitable franchise investments.

### 🌟 Key Features

- **Franchise Discovery**: Comprehensive directory with advanced search and filtering
- **Educational Content**: Blog integration with success stories and industry insights
- **Assessment Tools**: Franchise readiness evaluation and matching system
- **Agent Network**: Direct connection with franchise consultants
- **Content Management**: Full CMS for franchise and content management

---

## 🏗️ Architecture

### Tech Stack

- **Frontend**: Next.js 15.4.4 with App Router, TypeScript 5.7.3, Tailwind CSS 4.1.13
- **CMS**: Payload CMS 3.56.0 with Vercel Postgres
- **UI Components**: shadcn/ui (New York style, Slate base color), Lucide React 0.469.0, class-variance-authority, clsx
- **Deployment**: Vercel with Vercel Postgres
- **Styling**: Tailwind CSS 4.1.13 with PostCSS
- **Package Manager**: pnpm (^9 || ^10)
- **Testing**: Playwright 1.54.1, Vitest 3.2.3
- **Runtime**: Node.js ^18.20.2 || >=20.9.0

### Project Structure

```
future-franchise-owners/
├── docs/                          # Project documentation
│   ├── CLIENT_REQUEST.md          # Project requirements
│   ├── TODO.md                    # Task breakdown
│   ├── PROGRESS.md                # Project tracking
│   ├── GUIDELINES.md              # Development standards
│   ├── PAYLOAD_CMS_DEPLOYMENT.md  # CMS deployment guide
│   └── DEVELOPMENT_PROCESS.md     # Development workflow
├── src/
│   ├── app/                       # Next.js app directory
│   ├── components/                # React components
│   ├── lib/                       # Utility functions
│   └── payload/                   # Payload CMS configuration
├── public/                        # Static assets
├── tests/                         # Test files
└── config files                   # Various configuration files
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js ^18.20.2 || >=20.9.0
- pnpm ^9 || ^10
- PostgreSQL database access (Vercel Postgres recommended)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd future-franchise-owners

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Set up database
pnpm db:setup
pnpm db:migrate

# Start development server
pnpm dev
```

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URI=your_postgresql_connection_string

# Payload CMS
PAYLOAD_SECRET=your_payload_secret_key

# Next.js
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# External Services
SUBSTACK_RSS_URL=your_substack_rss_feed
SENDGRID_API_KEY=your_sendgrid_api_key
```

---

## 📚 Documentation

### Core Documentation

- **[CLIENT_REQUEST.md](./docs/CLIENT_REQUEST.md)** - Complete project requirements and specifications
- **[DEVELOPMENT_PROCESS.md](./docs/DEVELOPMENT_PROCESS.md)** - Step-by-step development workflow
- **[GUIDELINES.md](./docs/GUIDELINES.md)** - Coding standards and project conventions
- **[TODO.md](./docs/TODO.md)** - Detailed task breakdown and priorities

### Technical Documentation

- **[PAYLOAD_CMS_DEPLOYMENT.md](./docs/PAYLOAD_CMS_DEPLOYMENT.md)** - CMS deployment and configuration
- **[PROGRESS.md](./docs/PROGRESS.md)** - Project timeline and milestone tracking

### Getting Started

1. **Read the Requirements**: Start with [CLIENT_REQUEST.md](./docs/CLIENT_REQUEST.md)
2. **Follow the Process**: Use [DEVELOPMENT_PROCESS.md](./docs/DEVELOPMENT_PROCESS.md)
3. **Check Guidelines**: Follow [GUIDELINES.md](./docs/GUIDELINES.md)
4. **Track Progress**: Monitor [TODO.md](./docs/TODO.md) and [PROGRESS.md](./docs/PROGRESS.md)

---

## 🛠️ Development

### Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm devsafe          # Clean .next and start dev server
pnpm build            # Build for production
pnpm start            # Start production server

# Testing
pnpm test             # Run all tests (integration + e2e)
pnpm test:int         # Run integration tests with Vitest
pnpm test:e2e         # Run end-to-end tests with Playwright

# Code Quality
pnpm lint             # Run ESLint

# Payload CMS
pnpm payload          # Run Payload CLI commands
pnpm generate:types   # Generate TypeScript types
pnpm generate:importmap # Generate import map
```

### Development Workflow

1. **Setup**: Follow the installation instructions above
2. **Development**: Use the development process outlined in [DEVELOPMENT_PROCESS.md](./docs/DEVELOPMENT_PROCESS.md)
3. **Standards**: Follow the guidelines in [GUIDELINES.md](./docs/GUIDELINES.md)
4. **Testing**: Ensure all tests pass before committing
5. **Deployment**: Follow the deployment guide in [PAYLOAD_CMS_DEPLOYMENT.md](./docs/PAYLOAD_CMS_DEPLOYMENT.md)

---

## 🎨 Design System

### Color Palette

- **Primary**: Slate-based color scheme
- **Accent**: Custom brand colors
- **Neutral**: Comprehensive gray scale

### Typography

- **Headings**: Inter font family
- **Body**: Inter font family
- **Code**: JetBrains Mono

### Components

Built with modern React and utility libraries:
- **Styling**: Tailwind CSS 4.1.13 with class-variance-authority
- **Utilities**: clsx for conditional classes, tailwind-merge for merging
- **Icons**: Lucide React 0.544.0 for consistent iconography
- **Animations**: tw-animate-css for enhanced animations
- **TypeScript**: Full type safety across all components

---

## 📱 Features

### Core Features

- **Franchise Directory**: Comprehensive listing with search and filters
- **Blog Integration**: Substack RSS feed integration for content
- **Assessment Portal**: Franchise readiness evaluation
- **Agent Network**: Connection with franchise consultants
- **Content Management**: Full CMS for franchise and page management

### Technical Features

- **Server-Side Rendering**: Next.js 15.4.4 App Router for optimal performance
- **Type Safety**: Full TypeScript 5.7.3 implementation
- **Modern React**: React 19.1.0 with React DOM 19.1.0
- **Responsive Design**: Mobile-first approach with Tailwind CSS 4.1.13
- **Rich Text Editing**: Payload Lexical editor integration
- **SEO Optimized**: Meta tags, structured data, and performance optimization
- **Accessibility**: WCAG 2.1 AA compliance

---

## 🚀 Deployment

### Vercel Deployment

The application is designed for deployment on Vercel with the following setup:

1. **Database**: Vercel Postgres for production data
2. **Media Storage**: Vercel Blob for file uploads
3. **CDN**: Automatic CDN for static assets
4. **Environment**: Production environment variables

### Deployment Process

1. Connect repository to Vercel
2. Configure environment variables
3. Set up database and run migrations
4. Deploy and verify functionality

For detailed deployment instructions, see [PAYLOAD_CMS_DEPLOYMENT.md](./docs/PAYLOAD_CMS_DEPLOYMENT.md).

---

## 🧪 Testing

### Testing Strategy

- **Integration Tests**: API endpoint and database testing with Vitest 3.2.3
- **End-to-End Tests**: User flow testing with Playwright 1.54.1
- **Component Testing**: React Testing Library 16.3.0
- **Test Environment**: jsdom 26.1.0

### Running Tests

```bash
# Run all tests (integration + e2e)
pnpm test

# Run specific test types
pnpm test:int         # Integration tests with Vitest
pnpm test:e2e         # End-to-end tests with Playwright
```

---

## 📊 Performance

### Performance Targets

- **Core Web Vitals**: All metrics in "Good" range
- **Lighthouse Score**: 90+ across all categories
- **Bundle Size**: Optimized for fast loading
- **Time to Interactive**: < 3 seconds on 3G

### Optimization Features

- **Image Optimization**: Next.js Image component with WebP support
- **Code Splitting**: Automatic route-based code splitting
- **Caching**: Aggressive caching strategies
- **Compression**: Gzip/Brotli compression enabled

---

## 🔒 Security

### Security Measures

- **Authentication**: Secure user authentication with NextAuth
- **Authorization**: Role-based access control
- **Data Validation**: Input validation and sanitization
- **HTTPS**: SSL/TLS encryption for all communications
- **Environment Variables**: Secure configuration management

### Security Best Practices

- Regular dependency updates
- Security audit with `pnpm audit`
- Input validation on all forms
- Secure headers configuration
- Rate limiting on API endpoints

---

## 🤝 Contributing

### Development Process

1. **Fork** the repository
2. **Create** a feature branch
3. **Follow** the guidelines in [GUIDELINES.md](./docs/GUIDELINES.md)
4. **Test** your changes thoroughly
5. **Submit** a pull request

### Code Standards

- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write tests for new features
- Follow the component structure guidelines
- Update documentation as needed

---

## 📞 Support

### Documentation

- **Project Docs**: All documentation in the `/docs` folder
- **Next.js**: [Official Documentation](https://nextjs.org/docs)
- **Payload CMS**: [Official Documentation](https://payloadcms.com/docs)
- **Tailwind CSS**: [Official Documentation](https://tailwindcss.com/docs)

### Community

- **Issues**: GitHub Issues for bug reports and feature requests
- **Discussions**: GitHub Discussions for questions and ideas
- **Discord**: Project Discord server (if available)

---

## 📄 License

This project is proprietary software. All rights reserved.

---

## 🏆 Project Status

- **Phase**: Planning & Setup Complete ✅
- **Next Phase**: Core Development
- **Documentation**: Complete
- **Ready for Development**: Yes

### Recent Updates

- ✅ All documentation finalized
- ✅ Development process established
- ✅ Project structure defined
- ✅ CMS deployment guide created
- 🎯 Ready to begin development

---

**Last Updated**: Project initialization  
**Version**: 1.0.0-alpha  
**Maintainers**: Development Team
