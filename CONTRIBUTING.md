# Contributing to GraphChat

Thank you for your interest in contributing to GraphChat! This document provides guidelines and instructions for contributing.

## 🌟 How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the behavior
- **Expected vs actual behavior**
- **Screenshots** if applicable
- **Environment details** (OS, Node version, browser)

**Example:**
```markdown
**Bug**: Intent matching fails for multi-word phrases

**Steps to Reproduce:**
1. Start customer-support-escalation scenario
2. Type "I am really frustrated with this"
3. See incorrect intent detection

**Expected:** Should detect "express-frustration" intent
**Actual:** Detects generic inquiry

**Environment:** Node 20, Chrome 120
```

### Suggesting Features

Feature suggestions are welcome! Please provide:

- **Use case**: Why is this feature needed?
- **Proposed solution**: How should it work?
- **Alternatives considered**: What other approaches exist?
- **Additional context**: Screenshots, mockups, etc.

### Pull Requests

1. **Fork** the repository
2. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests** and ensure they pass
5. **Commit** with clear messages:
   ```bash
   git commit -m "feat: add amazing feature"
   ```
6. **Push** to your fork:
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Test additions/changes
- `chore:` Build process, tooling, etc.

**Examples:**
```bash
feat: add emotion detection to intent engine
fix: resolve graph viewer zoom issue in Safari
docs: update API reference documentation
refactor: simplify dialogue generator logic
```

## 📋 Development Setup

### Prerequisites

- Node.js 18+
- npm 9+
- Git

### Installation

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/graphchat.git
cd graphchat

# Install dependencies
npm install

# Start development servers
npm run dev
```

### Running Tests

```bash
# All tests
npm test

# With coverage
npm run test:coverage

# Specific workspace
npm run test --workspace @conversation-trainer/api
```

### Building

```bash
# Build all packages
npm run build

# Build specific package
npm run build --workspace @conversation-trainer/api
```

## 📝 Scenario Creation

When creating new scenarios:

1. **Define clear learning objectives**
2. **Create distinct personas** with backstories
3. **Write diverse intent examples** (5+ per intent)
4. **Add dialogue variations** to avoid repetition
5. **Test thoroughly** with different inputs
6. **Document difficulty and estimated duration**

### Scenario Quality Checklist

- [ ] Personas have clear goals and pain points
- [ ] Intents have 5+ diverse examples
- [ ] Dialogue variations (2+) per bot node
- [ ] Emotions specified for key nodes
- [ ] Learning objectives documented
- [ ] All edges have appropriate triggers
- [ ] Scenario validates successfully

## 🎨 Code Style

### TypeScript

- Use strict mode
- Define explicit types (avoid `any`)
- Use interfaces for object shapes
- Export types from `packages/types`

### React

- Use functional components with hooks
- Prefer composition over inheritance
- Keep components small and focused
- Use TypeScript for props and state

### Naming Conventions

- **Files**: PascalCase for components, camelCase for utilities
- **Components**: PascalCase (e.g., `ChatContainer`)
- **Functions/Variables**: camelCase (e.g., `sendMessage`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RETRIES`)
- **Types/Interfaces**: PascalCase (e.g., `ConversationNode`)

## 📖 Documentation

When adding features, please update:

- **README.md**: Feature overview and usage
- **API Reference**: New endpoints or changes
- **TypeScript types**: Update `packages/types`
- **Comments**: Complex logic should be documented

## 🚀 Release Process

Releases are managed by maintainers. The process:

1. Version bump in `package.json` files
2. Update CHANGELOG.md
3. Create git tag
4. Publish to npm (for packages)
5. Create GitHub release

## 💬 Community

- **Discord**: [Join our server](https://discord.gg/graphchat)
- **Twitter**: [@GraphChat](https://twitter.com/graphchat)
- **Email**: contributors@graphchat.dev

## 🙏 Code of Conduct

Please be respectful and constructive. We're committed to providing a welcoming environment for all contributors.

---

Thank you for contributing to GraphChat! 🎉
