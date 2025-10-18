# 🤝 Contributing to Car Go Rentals

Thank you for your interest in contributing to Car Go Rentals! This document provides guidelines and instructions for contributing.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

---

## 📜 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- Harassment, trolling, or discriminatory comments
- Publishing others' private information
- Any conduct that could be considered inappropriate in a professional setting

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.18.0
- npm >= 9.0.0
- Git
- Code editor (VS Code recommended)

### Fork and Clone

1. **Fork the repository** on GitHub
2. **Clone your fork**:
```bash
git clone https://github.com/YOUR_USERNAME/car-go-rentals.git
cd car-go-rentals
```

3. **Add upstream remote**:
```bash
git remote add upstream https://github.com/lookymlive/car-go-rentals.git
```

4. **Install dependencies**:
```bash
npm install
```

5. **Set up environment**:
```bash
cp .env.example .env.local
# Edit .env.local with your credentials
```

6. **Run development server**:
```bash
npm run dev
```

---

## 🔄 Development Workflow

### 1. Create a Branch

Always create a new branch for your work:

```bash
# Update main branch
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

**Branch naming conventions:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding tests
- `chore/` - Maintenance tasks

### 2. Make Changes

- Write clean, readable code
- Follow existing code style
- Add comments for complex logic
- Update documentation if needed

### 3. Test Your Changes

```bash
# Run linting
npm run lint

# Type checking
npm run type-check

# Build test
npm run build

# Manual testing
npm run dev
```

### 4. Commit Changes

```bash
git add .
git commit -m "feat: add new feature"
```

See [Commit Guidelines](#commit-guidelines) below.

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

---

## 💻 Coding Standards

### TypeScript

- **Use TypeScript** for all new files
- **Define types** explicitly, avoid `any`
- **Use interfaces** for object shapes
- **Export types** from `models/` directory

**Good:**
```typescript
interface CarProps {
  id: number;
  make: string;
  model: string;
}

function getCar(id: number): Promise<CarProps> {
  // ...
}
```

**Bad:**
```typescript
function getCar(id: any): any {
  // ...
}
```

### React Components

- **Use functional components** with hooks
- **Extract custom hooks** for reusable logic
- **Use proper naming**: PascalCase for components
- **Keep components small** and focused

**Good:**
```typescript
interface CarCardProps {
  car: IResCarProps;
  onSelect: (id: number) => void;
}

export function CarCard({ car, onSelect }: CarCardProps) {
  return (
    <div onClick={() => onSelect(car.id)}>
      <h3>{car.make} {car.model}</h3>
    </div>
  );
}
```

### File Organization

```
src/
├── app/              # Next.js routes
├── components/       # Shared components
├── features/         # Feature modules
│   └── cars/
│       ├── components/
│       ├── hooks/
│       └── index.tsx
├── hooks/           # Global hooks
├── models/          # TypeScript types
├── services/        # API services
└── utils/           # Utility functions
```

### Naming Conventions

- **Components**: `PascalCase` (e.g., `CarCard.tsx`)
- **Hooks**: `camelCase` with `use` prefix (e.g., `useCarFilters.ts`)
- **Utils**: `camelCase` (e.g., `formatPrice.ts`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_PRICE`)
- **Types/Interfaces**: `PascalCase` with `I` prefix for interfaces

### Code Style

- **Indentation**: 2 spaces
- **Quotes**: Single quotes for strings
- **Semicolons**: Required
- **Line length**: Max 80 characters (flexible)
- **Trailing commas**: Yes

Run Prettier to auto-format:
```bash
npm run format
```

---

## 📝 Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/).

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
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements

### Examples

```bash
# Feature
git commit -m "feat(cars): add filter by fuel type"

# Bug fix
git commit -m "fix(auth): resolve login redirect issue"

# Documentation
git commit -m "docs: update API reference"

# Refactor
git commit -m "refactor(components): extract CarCard component"

# With body
git commit -m "feat(booking): add date validation

- Add min/max date constraints
- Validate booking period
- Show error messages"
```

### Commit Message Rules

- Use imperative mood ("add" not "added")
- Don't capitalize first letter
- No period at the end
- Keep subject line under 50 characters
- Separate subject from body with blank line
- Wrap body at 72 characters

---

## 🔀 Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] No TypeScript errors
- [ ] No console errors/warnings
- [ ] Documentation updated
- [ ] Self-review completed

### PR Title

Use conventional commit format:
```
feat(cars): add advanced filtering options
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
How to test these changes

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings
```

### Review Process

1. **Automated checks** must pass (linting, build)
2. **Code review** by maintainer
3. **Address feedback** if requested
4. **Approval** and merge

### After Merge

- Delete your branch
- Update your local repository:
```bash
git checkout main
git pull upstream main
```

---

## 🧪 Testing

### Manual Testing

Test your changes thoroughly:

1. **Functionality**: Feature works as expected
2. **Edge cases**: Handle errors gracefully
3. **Responsive**: Works on mobile/tablet/desktop
4. **Browsers**: Test on Chrome, Firefox, Safari
5. **Performance**: No significant slowdowns

### Test Checklist

- [ ] Happy path works
- [ ] Error handling works
- [ ] Loading states display
- [ ] Responsive on all devices
- [ ] No console errors
- [ ] Accessibility (keyboard navigation)

---

## 📚 Documentation

### When to Update Docs

Update documentation when you:
- Add new features
- Change APIs or interfaces
- Modify configuration
- Add dependencies
- Change deployment process

### Documentation Files

- `README.md` - Project overview
- `docs/api-reference.md` - API documentation
- `docs/database-schema.md` - Database structure
- `docs/deployment.md` - Deployment guide
- Code comments - Complex logic explanation

### Writing Style

- Be clear and concise
- Use examples
- Include code snippets
- Add screenshots when helpful
- Keep it up to date

---

## 🎯 Areas for Contribution

### Good First Issues

Look for issues labeled `good first issue`:
- Documentation improvements
- UI/UX enhancements
- Bug fixes
- Test coverage

### Feature Requests

Check the roadmap in README.md:
- Payment integration
- Email notifications
- Analytics dashboard
- Mobile app
- Multi-language support

### Bug Reports

Found a bug? Open an issue with:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots
- Environment details

---

## 💬 Communication

### Questions

- Open a GitHub Discussion
- Comment on relevant issues
- Email: lookymlive@gmail.com

### Reporting Issues

Use GitHub Issues with appropriate labels:
- `bug` - Something isn't working
- `enhancement` - New feature request
- `documentation` - Documentation improvement
- `question` - Further information needed

---

## 🏆 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## 🙏 Thank You!

Your contributions make this project better for everyone. We appreciate your time and effort!

**Happy Coding! 🚀**
