# Security Guidelines for Wine Catalog

## 🔒 Security Best Practices

### Git Hooks & Automated Security

#### 🛡️ **Pre-commit Hook Features:**

Our git pre-commit hook automatically scans for:

1. **API Keys & Tokens**:
   - API keys, secrets, access tokens
   - JWT secrets (excluding templates)
   - Client secrets and auth tokens

2. **Database Credentials**:
   - MongoDB, MySQL, PostgreSQL connection strings with passwords
   - Database URLs with embedded credentials

3. **Private Keys**:
   - RSA, DSA, EC private keys
   - PEM, P12, PFX certificate files

4. **Environment Files**:
   - `.env` files (except `.env.example`)
   - Credential and secret files

5. **Cloud Provider Keys**:
   - AWS access keys
   - Google Cloud API keys

#### 🚀 **Quick Setup:**

```bash
# Run the setup script
./scripts/setup-dev.sh

# Or manually configure
chmod +x .githooks/pre-commit
git config core.hooksPath .githooks
```

#### 🔧 **Hook Configuration:**

The hook is designed to be smart about false positives:
- Ignores placeholder values like `YOUR_PASSWORD`
- Skips example files and documentation
- Allows `change_me` and `example` patterns
- Focuses on real secrets that could cause security issues

### Environment Variables & Secrets Management

#### ✅ **What We've Secured:**

1. **Environment Files**:
   - `.env` files are excluded from git via `.gitignore`
   - Created `.env.example` template without actual secrets
   - All services use environment variables instead of hardcoded passwords

2. **Docker Configuration**:
   - Removed hardcoded passwords from `docker-compose.yml`
   - Used environment variable substitution with secure defaults
   - MongoDB and Mongo Express passwords are configurable

3. **Documentation**:
   - Removed all hardcoded secrets from README files
   - Added security warnings about environment variables
   - Provided templates instead of actual values

4. **Scripts & Code**:
   - Test scripts use environment variables
   - Seed scripts accept configurable credentials
   - No hardcoded passwords in source code

#### 🚨 **Critical Security Requirements:**

1. **Before Going Public:**
   ```bash
   # Ensure these files are never committed:
   backend/.env
   **/*.env
   *.key
   *.pem
   credentials/
   secrets/
   ```

2. **Production Deployment:**
   - Generate strong, unique passwords (minimum 32 characters)
   - Use secure random JWT secrets
   - Enable SSL/TLS encryption
   - Use environment variable injection (not .env files)
   - Implement proper logging and monitoring

3. **Development Setup:**
   ```bash
   # Copy template and customize
   cp backend/.env.example backend/.env
   
   # Generate secure JWT secret (example)
   openssl rand -base64 32
   ```

#### 🔍 **Automated Security Checks:**

The pre-commit hook will block commits containing:
- Real API keys or tokens
- Database connection strings with passwords
- Private key files
- Environment files with secrets
- Hardcoded passwords (non-placeholder)

#### 🛡️ **Additional Security Measures:**

1. **JWT Security**:
   - Tokens expire in 7 days (configurable)
   - Secure secret key (minimum 32 characters)
   - Proper token validation and error handling

2. **Password Security**:
   - bcrypt hashing with salt rounds
   - Minimum password length requirements
   - No password storage in logs or responses

3. **Database Security**:
   - User-specific data isolation
   - Input validation and sanitization
   - Proper error handling without data leakage

4. **API Security**:
   - CORS configuration
   - Authentication required for all wine endpoints
   - Input validation on all endpoints

### 🚨 **Emergency Procedures:**

If you need to bypass the hook temporarily (not recommended):
```bash
git commit --no-verify -m "Emergency commit"
```

**⚠️ Warning**: Only use `--no-verify` in true emergencies and always review the commit afterwards!

### 🧪 **Testing Security:**

```bash
# Test the pre-commit hook
.githooks/pre-commit

# Verify .env is ignored
git check-ignore backend/.env

# Check for any uncommitted secrets
git status --ignored
```

### 🎯 **Current Status:**

✅ **Secured for Public Repository**
- All hardcoded secrets removed
- Pre-commit hook preventing future secret commits
- Environment variable templates provided
- Documentation sanitized
- Git ignore properly configured

✅ **Development Security**
- Automated secret scanning
- Environment file protection
- Smart false positive handling
- Developer-friendly setup process

⚠️ **Still Needed for Production:**
- SSL/TLS certificate setup
- Production environment variable injection
- Rate limiting middleware
- Security headers middleware
- Logging and monitoring setup
- Regular security audits

### 📚 **Resources:**

- [Git Hooks Documentation](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)
- [OWASP Security Guidelines](https://owasp.org/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

The repository is now comprehensively protected against accidental secret commits!
