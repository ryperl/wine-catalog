# 🚀 CI/CD Setup for Wine Catalog

This document explains the automated validation and deployment pipeline for the Wine Catalog project.

## 📋 Overview

The project uses GitHub Actions to automatically validate all pull requests and maintain code quality. The pipeline includes:

- **TypeScript compilation** checking
- **Unit and integration tests**
- **Code linting and formatting**
- **Security vulnerability scanning**
- **Dependency auditing**
- **Build validation**

## 🔄 Workflows

### 1. Quick Validation (`.github/workflows/quick-validation.yml`)
**Triggers:** Every push and PR to `main`
**Runtime:** ~2-3 minutes

- ✅ TypeScript type checking
- ✅ Unit tests with Jest
- ✅ ESLint code quality checks
- ✅ Security audit
- 💬 Automatic PR comments with results

### 2. Comprehensive Validation (`.github/workflows/pr-validation.yml`)
**Triggers:** Pull requests to `main`
**Runtime:** ~5-10 minutes

#### Backend Tests & Validation
- Tests on Node.js 18.x and 20.x
- Full test suite with coverage
- Code quality analysis
- Security vulnerability scanning

#### Security & Secret Scanning
- TruffleHog secret detection
- CodeQL security analysis
- Dependency vulnerability checks

#### Build & Integration Tests
- Real MongoDB integration
- Production build validation
- Health check verification
- End-to-end API testing

#### Dependency Security Check
- High-severity vulnerability detection
- Outdated dependency reporting
- Automated security advisories

#### PR Quality Checks
- Commit message validation
- Semantic PR title checking
- Breaking change detection

## 🛡️ Branch Protection

Run the setup script to enable branch protection:

```bash
./scripts/setup-branch-protection.sh
```

### Protection Rules:
- **Required PR reviews:** 1 approval minimum
- **Dismiss stale reviews** when new commits are pushed
- **Required status checks** must pass before merging
- **Up-to-date branches** required before merging
- **No force pushes** or deletions allowed
- **Admin enforcement** enabled

### Required Status Checks:
- Quick Validation / quick-check
- Backend Tests & Validation (Node 18.x, 20.x)
- Security & Secret Scanning
- Build & Integration Test

## 📝 Commit Standards

We use [Conventional Commits](https://www.conventionalcommits.org/) for consistency:

### Format:
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code formatting
- `refactor`: Code restructuring
- `test`: Adding/updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes
- `build`: Build system changes
- `perf`: Performance improvements
- `revert`: Reverting changes

### Examples:
```bash
feat(auth): add JWT token refresh functionality
fix(wine): resolve validation error in update endpoint
docs(api): update authentication documentation
test(wine): add integration tests for wine CRUD operations
```

## 🧪 Local Development

### Run All Validations Locally:
```bash
cd backend
npm run validate  # Type check + lint + test
```

### Individual Checks:
```bash
npm run type-check    # TypeScript compilation
npm run lint:check    # ESLint with zero warnings
npm run test:ci       # Tests with coverage
npm run test:coverage # Generate coverage report
```

### Pre-commit Hook:
The git pre-commit hook automatically:
- Scans for secrets and sensitive information
- Allows bypass comments for test values
- Provides smart detection for test files

## 📊 Coverage Requirements

- **Minimum coverage:** 80% (recommended)
- **Coverage reports** uploaded to Codecov
- **Failed tests** block PR merging
- **Coverage trends** tracked over time

## 🚨 Handling CI Failures

### Common Issues:

#### TypeScript Errors:
```bash
npm run type-check
# Fix compilation errors in src/
```

#### Test Failures:
```bash
npm test
# Review failing tests and fix
```

#### Lint Issues:
```bash
npm run lint:fix
# Auto-fix formatting issues
```

#### Security Vulnerabilities:
```bash
npm audit fix
# Update vulnerable dependencies
```

### Emergency Bypass:
If you need to bypass CI checks (use sparingly):
```bash
git commit --no-verify
```

## 🔧 Configuration Files

- **`.github/workflows/`** - GitHub Actions workflows
- **`.commitlintrc.json`** - Commit message validation
- **`jest.config.json`** - Test configuration
- **`tsconfig.json`** - TypeScript configuration
- **`.eslintrc.js`** - Code quality rules

## 📈 Monitoring & Metrics

### GitHub Actions Dashboard:
- View workflow runs in the **Actions** tab
- Monitor success/failure rates
- Review detailed logs and timing

### Coverage Reports:
- Codecov integration for coverage tracking
- PR coverage diff comments
- Coverage trends and historical data

### Security Monitoring:
- Dependabot alerts for vulnerabilities
- Automated security updates
- Secret scanning alerts

## 🔄 Continuous Improvement

### Adding New Checks:
1. Update workflow files in `.github/workflows/`
2. Add corresponding npm scripts
3. Update branch protection rules
4. Document new requirements

### Performance Optimization:
- Use caching for dependencies
- Parallel job execution
- Selective test running based on changes
- Artifact reuse between jobs

## 🆘 Troubleshooting

### Workflow Won't Run:
- Check file syntax with YAML validator
- Verify workflow triggers in `.github/workflows/`
- Ensure repository has Actions enabled

### Tests Timeout:
- Increase timeout in `jest.config.json`
- Check for hanging async operations
- Review MongoDB connection handling

### Security Scan False Positives:
- Add `# secret-ignore` comments
- Update `.githooks/pre-commit` patterns
- Use environment variables for sensitive data

## 📚 Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Jest Testing Framework](https://jestjs.io/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [TruffleHog Secret Detection](https://github.com/trufflesecurity/trufflehog)
