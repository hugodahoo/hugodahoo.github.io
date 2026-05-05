# 🚀 GitHub Pages Deployment Guide

## 📋 Prerequisites

1. **GitHub Account**: You need a GitHub account
2. **Git Installed**: Make sure Git is installed on your computer
3. **Repository**: Create a new repository named `hugodahoo.github.io`

## 🎯 Step-by-Step Deployment

### 1. Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. **Important**: Name it exactly `hugodahoo.github.io`
5. Make it **Public** (required for free GitHub Pages)
6. Don't initialize with README (we already have one)
7. Click "Create repository"

### 2. Initialize Git in Your Project

Open PowerShell/Command Prompt in your project folder and run:

```bash
# Initialize git repository
git init

# Add your GitHub repository as remote
git remote add origin https://github.com/hugodahoo/hugodahoo.github.io.git

# Add all files
git add .

# Make your first commit
git commit -m "Initial portfolio deployment"

# Push to GitHub
git push -u origin main
```

### 3. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on "Settings" tab
3. Scroll down to "Pages" section
4. Under "Source", select "Deploy from a branch"
5. Select "main" branch and "/ (root)" folder
6. Click "Save"

### 4. Automatic Deployment

Your site will be automatically deployed! It may take 5-10 minutes for the first deployment.

**Your portfolio will be live at:** `https://hugodahoo.github.io`

## 🔄 Future Updates

### Option 1: Use the Deployment Script (Recommended)

```bash
./deploy-to-github.sh
```

### Option 2: Manual Git Commands

```bash
git add .
git commit -m "Update portfolio"
git push origin main
```

## 🛠️ Troubleshooting

### Common Issues

1. **Repository Name**: Must be exactly `hugodahoo.github.io`
2. **Public Repository**: GitHub Pages requires public repos for free accounts
3. **Branch Name**: Use `main` branch (not `master`)
4. **File Structure**: Make sure `site/` folder contains your website files

### Check Deployment Status

1. Go to your repository on GitHub
2. Click "Actions" tab
3. Look for deployment status
4. Green checkmark = successful deployment

### Force Refresh

If changes don't appear:
1. Hard refresh your browser (Ctrl+F5)
2. Clear browser cache
3. Wait 5-10 minutes for GitHub's CDN to update

## 📁 File Structure for GitHub Pages

```
hugodahoo.github.io/
├── site/                    # Your website files
│   ├── index.html          # Homepage
│   ├── project.html        # Project pages
│   ├── styles.css          # Styles
│   ├── neural-network.js   # JavaScript
│   ├── data.js            # Project data
│   └── media/             # Images
├── .github/workflows/      # Auto-deployment
├── README.md              # Repository info
└── .gitignore             # Git ignore rules
```

## 🎨 Custom Domain (Optional)

If you want a custom domain like `hugodaoust.com`:

1. Add a `CNAME` file in the `site/` folder with your domain
2. Configure DNS settings with your domain provider
3. Enable "Enforce HTTPS" in GitHub Pages settings

## 📊 Analytics (Optional)

Add Google Analytics:
1. Get tracking code from Google Analytics
2. Add it to `site/index.html` in the `<head>` section
3. Deploy the changes

## 🚀 Success!

Once deployed, your portfolio will be:
- ✅ **Live**: Available worldwide at `https://hugodahoo.github.io`
- ✅ **Fast**: Served by GitHub's CDN
- ✅ **Secure**: HTTPS enabled by default
- ✅ **Automatic**: Updates deploy automatically when you push changes

---

**Need help?** Check the GitHub Pages documentation or open an issue in your repository.
