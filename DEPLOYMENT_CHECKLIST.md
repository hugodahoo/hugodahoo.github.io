# ✅ GitHub Pages Deployment Checklist

## Before Deployment

- [ ] **Repository Created**: `hugo-daoust.github.io` on GitHub
- [ ] **Repository is Public**: Required for free GitHub Pages
- [ ] **Git Initialized**: `git init` in project folder
- [ ] **Remote Added**: `git remote add origin https://github.com/hugo-daoust/hugo-daoust.github.io.git`
- [ ] **Files Cleaned**: Unnecessary files excluded via `.gitignore`
- [ ] **Localhost References Removed**: No localhost URLs in code
- [ ] **Site Tested Locally**: Everything works on `http://localhost:3000`

## Deployment Steps

- [ ] **Add Files**: `git add .`
- [ ] **Commit Changes**: `git commit -m "Initial portfolio deployment"`
- [ ] **Push to GitHub**: `git push -u origin main`
- [ ] **Enable GitHub Pages**: Settings → Pages → Deploy from branch → main
- [ ] **Wait for Deployment**: 5-10 minutes for first deployment

## After Deployment

- [ ] **Site Accessible**: `https://hugo-daoust.github.io` loads
- [ ] **All Pages Work**: Homepage and project pages load correctly
- [ ] **Images Load**: Thumbnails and media display properly
- [ ] **Interactive Features**: Hover effects and navigation work
- [ ] **Mobile Responsive**: Site works on mobile devices
- [ ] **HTTPS Enabled**: Site uses secure connection

## Quick Commands

```bash
# Initialize and deploy
git init
git remote add origin https://github.com/hugo-daoust/hugo-daoust.github.io.git
git add .
git commit -m "Initial portfolio deployment"
git push -u origin main

# Future updates
git add .
git commit -m "Update portfolio"
git push origin main
```

## Troubleshooting

- **404 Error**: Check repository name is exactly `hugo-daoust.github.io`
- **Images Not Loading**: Verify `media/` folder is included
- **Styling Issues**: Check CSS file paths are relative
- **JavaScript Errors**: Open browser console to debug

## Success! 🎉

Your portfolio is now live at: **https://hugo-daoust.github.io**
