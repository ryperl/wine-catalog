#!/bin/bash

# GitHub Branch Protection Setup Script
# This script helps configure branch protection rules via GitHub CLI

echo "🔒 Setting up branch protection for wine-catalog repository"

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI is not installed. Please install it first:"
    echo "   brew install gh"
    echo "   or visit: https://cli.github.com/"
    exit 1
fi

# Check if user is authenticated
if ! gh auth status &> /dev/null; then
    echo "🔑 Please authenticate with GitHub first:"
    gh auth login
fi

echo "📋 Current repository:"
gh repo view --json name,owner

echo "🛡️ Setting up branch protection for 'main' branch..."

# Enable branch protection with required status checks
gh api repos/:owner/:repo/branches/main/protection \
  --method PUT \
  --field required_status_checks='{
    "strict": true,
    "contexts": [
      "Quick Validation / quick-check",
      "Backend Tests & Validation (18.x)",
      "Backend Tests & Validation (20.x)",
      "Security & Secret Scanning / security-scan",
      "Build & Integration Test / build-test"
    ]
  }' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{
    "required_approving_review_count": 1,
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": false
  }' \
  --field restrictions=null \
  --field allow_force_pushes=false \
  --field allow_deletions=false

echo "✅ Branch protection rules set up successfully!"

echo ""
echo "📝 Summary of protection rules:"
echo "   ✅ Require pull request reviews (1 approval)"
echo "   ✅ Dismiss stale reviews when new commits are pushed"
echo "   ✅ Require status checks to pass before merging"
echo "   ✅ Require branches to be up to date before merging"
echo "   ✅ Enforce restrictions for administrators"
echo "   ❌ Prohibit force pushes"
echo "   ❌ Prohibit deletions"

echo ""
echo "🚀 Required status checks:"
echo "   • Quick Validation (TypeScript, tests, lint)"
echo "   • Backend Tests (Node 18.x and 20.x)"
echo "   • Security scanning"
echo "   • Build and integration tests"

echo ""
echo "💡 To bypass these checks in emergency situations:"
echo "   gh api repos/:owner/:repo/branches/main/protection --method DELETE"
echo "   (Run this script again to re-enable)"
