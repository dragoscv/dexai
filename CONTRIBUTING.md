# Contributing to DEXAI.ro

🇷🇴 Mulțumim pentru interesul de a contribui la DEXAI.ro! / Thank you for your interest in contributing to DEXAI.ro!

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Code Style Guidelines](#code-style-guidelines)
- [Git Workflow](#git-workflow)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Security Issues](#security-issues)

## 📜 Code of Conduct

This project adheres to the Contributor Covenant [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## 🤝 How Can I Contribute?

### Ways to Contribute

1. **Code Contributions**
   - Fix bugs
   - Implement new features
   - Improve performance
   - Enhance UI/UX

2. **Documentation**
   - Improve README and guides
   - Add code comments
   - Write tutorials
   - Translate documentation

3. **Community Validation**
   - Validate word definitions
   - Report incorrect information
   - Suggest improvements

4. **Bug Reports**
   - Report issues with clear reproduction steps
   - Suggest fixes or improvements

5. **Feature Requests**
   - Propose new features
   - Discuss enhancements

### Reporting Bugs

When reporting bugs, please include:
- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected behavior** vs **actual behavior**
- **Screenshots** if applicable
- **Environment details** (browser, OS, device)
- **Console errors** if any

Use the issue template when available.

### Suggesting Features

When suggesting features:
- **Use a clear and descriptive title**
- **Provide a detailed description** of the feature
- **Explain why this feature would be useful**
- **Include mockups or examples** if applicable

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+ and pnpm
- Firebase project (for authentication and database)
- Azure OpenAI API key

### Setup Steps

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/dexai.git
   cd dexai
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Variables**
   
   Copy `.env.example` to `.env.local` and fill in your credentials:
   ```bash
   cp .env.example .env.local
   ```

   Required variables:
   - Firebase config (public)
   - Firebase Admin SDK credentials (private)
   - Azure OpenAI credentials (private)

4. **Run Development Server**
   ```bash
   pnpm dev
   ```

5. **Open Browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Project Structure

```
dexai/
├── app/                 # Next.js App Router pages
│   ├── api/            # API routes
│   ├── cuvant/         # Word detail pages
│   └── ...
├── components/         # React components
├── lib/               # Utilities and services
│   ├── firebase.ts           # Client SDK
│   ├── firebase-admin.ts     # Admin SDK
│   ├── azure-ai.ts           # AI integration
│   ├── rate-limit.ts         # Rate limiting
│   └── sanitize.ts           # Input sanitization
└── types/             # TypeScript type definitions
```

## 📝 Code Style Guidelines

### TypeScript

- **Use TypeScript** for all new code
- **Define types** for all data structures
- **Avoid `any`** - use proper types or `unknown`
- **Use interfaces** for object shapes
- **Export types** from `types/index.ts`

### React Components

- **Functional components** with hooks
- **Use 'use client'** directive for client components
- **Descriptive component names** in PascalCase
- **Props interfaces** named `ComponentNameProps`
- **Destructure props** in function parameters

Example:
```typescript
'use client';

interface ButtonProps {
    label: string;
    onClick: () => void;
    disabled?: boolean;
}

export default function Button({ label, onClick, disabled = false }: ButtonProps) {
    return (
        <button onClick={onClick} disabled={disabled}>
            {label}
        </button>
    );
}
```

### Styling

- **Tailwind CSS** for all styling
- **Utility-first approach**
- **Responsive design** with mobile-first
- **Consistent spacing** using Tailwind scale
- **Dark mode support** where applicable

### File Naming

- **Components**: PascalCase (e.g., `WordHeader.tsx`)
- **Utilities**: camelCase (e.g., `normalize-word.ts`)
- **API routes**: lowercase with hyphens (e.g., `search/route.ts`)

### Code Quality

- **ESLint**: Run `pnpm lint` before committing
- **Type checking**: Run `pnpm type-check`
- **Clean code**: Remove console.logs in production code
- **Comments**: Add JSDoc comments for complex functions

## 🔄 Git Workflow

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation changes
- `refactor/description` - Code refactoring
- `security/description` - Security fixes

Examples:
```bash
feature/word-audio-pronunciation
fix/vote-counter-display
docs/api-documentation
security/xss-prevention
```

### Workflow Steps

1. **Fork the repository**
2. **Create a feature branch** from `main`
3. **Make your changes**
4. **Test thoroughly**
5. **Commit with descriptive messages**
6. **Push to your fork**
7. **Open a Pull Request**

## 💬 Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `security`: Security improvements
- `perf`: Performance improvements

### Examples

```bash
feat(voting): add community voting system

Implemented like, dislike, validate, and report_error voting types.
Auto-verification triggers at 5+ validations with <3 errors.

Closes #42
```

```bash
fix(search): sanitize user input to prevent XSS

Added input sanitization using lib/sanitize.ts for all user-provided
text including word names and flag reasons.

Security: Prevents XSS attacks
```

```bash
docs(readme): add contributing guidelines

Added comprehensive CONTRIBUTING.md with development setup,
code style guidelines, and PR process.
```

## 🔀 Pull Request Process

### Before Submitting

1. **Update documentation** if needed
2. **Add tests** for new features
3. **Run linter**: `pnpm lint`
4. **Type check**: `pnpm type-check`
5. **Build successfully**: `pnpm build`
6. **Test manually** in browser

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How was this tested?

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests added/updated
- [ ] Passes all checks
```

### Review Process

1. **Automated checks** must pass (lint, type-check, build)
2. **Code review** by maintainers
3. **Address feedback** promptly
4. **Squash commits** if requested
5. **Merge** after approval

### Getting Your PR Merged

- **Be responsive** to feedback
- **Keep PRs focused** - one feature/fix per PR
- **Update your branch** if conflicts arise
- **Be patient** - reviews take time

## 🔒 Security Issues

**DO NOT** open public issues for security vulnerabilities.

Instead, email security details to the maintainers privately. We will:
1. Acknowledge receipt within 48 hours
2. Investigate and confirm the issue
3. Develop a fix
4. Release a security patch
5. Credit you in the security advisory (if desired)

See [SECURITY_AUDIT.md](SECURITY_AUDIT.md) for our security practices.

## 🎯 Good First Issues

Look for issues labeled `good first issue` for beginner-friendly contributions.

## 💡 Need Help?

- **Discussion**: Open a GitHub Discussion
- **Questions**: Comment on relevant issues
- **Real-time**: Join our community (link TBD)

## 🙏 Thank You!

Your contributions make DEXAI.ro better for everyone. We appreciate your time and effort!

---

**Happy Contributing! 🚀**
