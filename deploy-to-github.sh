#!/bin/bash

# Hugo Daoust Portfolio - GitHub Pages Deployment Script

echo "🚀 Deploying Hugo Daoust Portfolio to GitHub Pages..."

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository. Please initialize git first."
    exit 1
fi

# Check if we have uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 You have uncommitted changes. Please commit them first:"
    git status
    exit 1
fi

# Add all files
echo "📁 Adding files to git..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Deploy portfolio to GitHub Pages - $(date)"

# Push to main branch
echo "🌐 Pushing to GitHub..."
git push origin main

echo "✅ Deployment complete!"
echo "🌍 Your portfolio will be available at: https://hugo-daoust.github.io"
echo "⏱️  It may take a few minutes for changes to appear."
