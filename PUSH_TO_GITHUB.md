# Push ShotsByFra Website to GitHub

Your complete ShotsByFra photography portfolio is ready to push to GitHub! 

## 🚀 Quick Push Commands

Run these commands from the `/workspace/deployment/` directory:

```bash
# Add your GitHub repository as remote
git remote add origin https://github.com/franceskomuca/franceskomuca.github.io.git

# Push to main branch (this will trigger GitHub Pages deployment)
git push -u origin main

# Verify the push
git status
```

## 📁 What's Being Pushed

✅ **Complete Website Files:**
- `index.html` - Main website (21 files, 3323+ lines)
- `assets/` - Optimized CSS/JS (228KB total)
- `images/` - Organized image directories
- `.github/workflows/deploy.yml` - GitHub Actions automation
- Complete documentation (DEPLOYMENT_GUIDE.md, etc.)

✅ **Automatic Integrations:**
- Google Drive API for photo syncing
- YouTube Data API for video updates
- Supabase backend for data management

## 🔄 After Push

Your website will be live at: **https://franceskomuca.github.io**

### Enable GitHub Pages:
1. Go to: https://github.com/franceskomuca/franceskomuca.github.io/settings/pages
2. Select: "GitHub Actions" as the source
3. Your site will be live in a few minutes!

### Custom Domain Setup:
1. Add your domain in GitHub Pages settings
2. Configure DNS records as per `CUSTOM-DOMAIN-SUTUP.md`
3. SSL certificate will be automatically provisioned

## 🔑 API Keys Needed

To activate automatic content updates, you'll need to configure:
- Google Drive API Key
- YouTube Data API v3 Key  
- Supabase credentials

See `DEPLOYMENT_GUIDE.md` for detailed API setup instructions.

---

**Ready to push? Just run the commands above and your ShotsByFra portfolio will be live!** 🎉