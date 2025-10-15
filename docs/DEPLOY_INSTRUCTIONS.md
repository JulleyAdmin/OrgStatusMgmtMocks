# Netlify Deployment Instructions

## Step-by-Step Guide

### 1. Open your terminal and navigate to mockups folder:
```bash
cd /Users/Girish/Projects/OrgStructure-TaskMgmt-Platform/mockups
```

### 2. Run the deploy command:
```bash
netlify deploy --prod
```

### 3. Answer the prompts:

**Prompt 1: "What would you like to do?"**
```
Select: + Create & configure a new project
(Press Down arrow once, then Enter)
```

**Prompt 2: "Team:"**
```
Select: girish-6x-wsmk's team
(Should be selected by default, press Enter)
```

**Prompt 3: "Site name (optional):"**
```
Type: orgstructure-mockups
(Then press Enter)
```
Note: If this name is taken, try: orgstructure-html-mockups or leave blank for random name

**Prompt 4: "Publish directory:"**
```
Type: .
(Just a dot, then press Enter)
```

### 4. Wait for upload
You'll see:
```
Deploying to production site URL...
✔ Finished hashing 24 files
✔ CDN requesting 24 files
✔ Finished uploading 24 files
✔ Deploy is live!
```

### 5. Get your URL!
```
Website URL: https://orgstructure-mockups.netlify.app
```

## Alternative: Quick Drag & Drop Method

If CLI gives you issues, use Netlify Drop:

1. Create zip file:
```bash
cd /Users/Girish/Projects/OrgStructure-TaskMgmt-Platform
zip -r mockups-deploy.zip mockups/
```

2. Go to: https://app.netlify.com/drop

3. Drag `mockups-deploy.zip` onto the page

4. Get instant URL!

## After Deployment

### To update your site later:
```bash
cd /Users/Girish/Projects/OrgStructure-TaskMgmt-Platform/mockups
netlify deploy --prod
```

### To change site name:
Go to: https://app.netlify.com → Your site → Site settings → Change site name

### To add password protection:
Site settings → Access control → Visitor access (requires paid plan)

## Share with Your Team

Once deployed, share this message:

```
Hi Team,

The HTML mockups are now live! 🎉

🔗 View mockups: https://[your-site-name].netlify.app

Explore all 20 screens:
- Dashboard with KPIs and charts
- Interactive org chart (D3.js)
- Workflow designer with drag-drop
- Calendar with event management
- And 16 more screens!

Please review and share feedback. Thanks!
```

## Troubleshooting

**Site name already taken?**
- Try: orgstructure-html-mockups
- Or: girish-orgstructure-mockups
- Or: leave blank for random name like "silly-einstein-123abc"

**Deploy failed?**
- Check internet connection
- Run: `netlify status` to verify login
- Try the drag & drop method instead

**Need to redeploy?**
```bash
cd /Users/Girish/Projects/OrgStructure-TaskMgmt-Platform/mockups
netlify deploy --prod
```

---

Good luck! 🚀
