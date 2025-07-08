#!/bin/bash

# Setup script for Wine Catalog development environment
# This script configures git hooks and other security measures

echo "🍷 Setting up Wine Catalog development environment..."

# Configure git hooks
echo "🔒 Configuring git security hooks..."
chmod +x .githooks/pre-commit
git config core.hooksPath .githooks

# Check if .env file exists, if not create from example
if [ ! -f "backend/.env" ]; then
    echo "📝 Creating .env file from template..."
    cp backend/.env.example backend/.env
    echo "⚠️  Please edit backend/.env with your actual configuration values"
else
    echo "✅ .env file already exists"
fi

# Verify .env is ignored
if git check-ignore backend/.env > /dev/null; then
    echo "✅ .env file is properly ignored by git"
else
    echo "⚠️  Warning: .env file is not ignored by git!"
fi

# Test the pre-commit hook
echo "🧪 Testing pre-commit hook..."
if .githooks/pre-commit; then
    echo "✅ Pre-commit hook is working correctly"
else
    echo "❌ Pre-commit hook test failed"
fi

echo ""
echo "🎉 Setup complete! Security measures are now active."
echo ""
echo "📋 Next steps:"
echo "1. Edit backend/.env with your actual configuration"
echo "2. Start development: npm run docker:up && npm run dev:backend"
echo "3. The pre-commit hook will automatically check for secrets"
echo ""
echo "🔒 Security features enabled:"
echo "- Pre-commit secret scanning"
echo "- Environment file protection"
echo "- Sensitive file detection"
echo ""
echo "To bypass the hook in emergencies: git commit --no-verify"
