---
name: deploy
description: Set up deployment to Cloudflare Pages. Guides through account creation, API tokens, GitHub secrets, and verifies the first deploy.
---

# Deploy to Cloudflare Pages

This skill sets up automatic deployment to Cloudflare Pages. Every push to `main` triggers a build and deploy.

## When to trigger

- User explicitly runs `/deploy`
- User asks about hosting, deployment, or "putting the site online"

## Prerequisites check

Before starting, verify:

1. The GitHub repo exists and has a remote (`git remote -v`)
2. The site builds locally (`pnpm build`)
3. The deploy workflow exists at `.github/workflows/deploy.yml`

If the workflow file is missing, create it from the template (see bottom of this file).

## Step 1: Cloudflare account

Ask:

> "Do you have a Cloudflare account? (The free plan is all you need)"

- **Yes** — proceed to Step 2
- **No** — tell them:
  > "Sign up at https://dash.cloudflare.com/sign-up — it's free. Come back when you're logged in."

Wait for confirmation before proceeding.

## Step 2: Create the Cloudflare Pages project

Guide the user:

> "Let's create your Cloudflare Pages project. Go to https://dash.cloudflare.com/ and:
>
> 1. Click **Workers & Pages** in the left sidebar
> 2. Click **Create** → **Pages** → **Direct Upload** (we deploy via GitHub Actions, not Git integration)
> 3. Name your project (e.g., your company name in lowercase, like `my-company`)
> 4. Upload any file to create the project (it will be overwritten on first deploy)
>
> Tell me the project name you chose."

Save the project name — it's needed for the GitHub variable.

## Step 3: Create API token

Guide the user:

> "Now let's create an API token for GitHub to deploy with:
>
> 1. Go to https://dash.cloudflare.com/profile/api-tokens
> 2. Click **Create Token**
> 3. Use the **Cloudflare Pages — Edit** template (or create custom with `Account.Cloudflare Pages: Edit` permission)
> 4. Under Account Resources, select your account
> 5. Click **Continue to summary** → **Create Token**
> 6. **Copy the token now** — you won't see it again!
>
> Also grab your **Account ID** from the Cloudflare dashboard sidebar (it's in the URL: `dash.cloudflare.com/<account-id>/...` or shown on the Workers & Pages overview page on the right side)."

Wait for both the API token and Account ID.

## Step 4: Add secrets to GitHub

Guide the user:

> "Now add these to your GitHub repository:
>
> 1. Go to your repo → **Settings** → **Secrets and variables** → **Actions**
> 2. Add these **secrets** (click **New repository secret**):
>    - Name: `CLOUDFLARE_API_TOKEN` — Value: (paste your API token)
>    - Name: `CLOUDFLARE_ACCOUNT_ID` — Value: (paste your account ID)
> 3. Switch to the **Variables** tab and add:
>    - Name: `CLOUDFLARE_PROJECT_NAME` — Value: `<the project name from Step 2>`
>
> Tell me when that's done."

Alternatively, if the user has `gh` CLI:

```bash
gh secret set CLOUDFLARE_API_TOKEN
gh secret set CLOUDFLARE_ACCOUNT_ID
gh variable set CLOUDFLARE_PROJECT_NAME --body "<project-name>"
```

## Step 5: Update the site URL

Once the user provides their Cloudflare Pages URL (or custom domain), update `astro.config.mjs`:

```javascript
site: "https://<project-name>.pages.dev",
```

If they have a custom domain, use that instead. This URL is used for canonical links, sitemap, and OG tags.

## Step 6: Trigger first deploy

```bash
git add -A
git commit -m "feat: configure Cloudflare Pages deployment"
git push
```

Then check the deployment:

> "Your site is deploying! You can watch the progress at:
>
> - **GitHub Actions**: https://github.com/<org>/<repo>/actions
> - **Cloudflare Dashboard**: https://dash.cloudflare.com/ → Workers & Pages → your project
>
> Once it's done (usually 1-2 minutes), your site will be live at:
> `https://<project-name>.pages.dev`"

## Step 7: Custom domain (optional)

If the user wants to use their own domain:

> "Want to use your own domain? In the Cloudflare Pages dashboard:
>
> 1. Go to your project → **Custom domains**
> 2. Click **Set up a custom domain**
> 3. Enter your domain (e.g., `www.example.com`)
> 4. Cloudflare will guide you through DNS setup
>
> If your domain is already on Cloudflare, it's automatic. Otherwise, you'll need to update your DNS records."

After adding a custom domain, update `astro.config.mjs` with the custom domain URL.

## Troubleshooting

**Deploy fails with "Project not found":**

- Check `CLOUDFLARE_PROJECT_NAME` variable matches the project name in Cloudflare exactly

**Deploy fails with "Authentication error":**

- Check `CLOUDFLARE_API_TOKEN` secret is set correctly
- Verify the token has Cloudflare Pages Edit permission
- Check `CLOUDFLARE_ACCOUNT_ID` is correct

**Build succeeds but site shows old content:**

- Cloudflare Pages caches aggressively. Wait 1-2 minutes or purge cache in Cloudflare dashboard.

**CI passes but deploy doesn't run:**

- Deploy only triggers on pushes to `main`, not on PRs
- Check the workflow file exists at `.github/workflows/deploy.yml`
- You can also manually trigger the deploy from Actions → Deploy → Run workflow

## Deploy workflow template

If `.github/workflows/deploy.yml` is missing, create it:

```yaml
name: Deploy

on:
  push:
    branches: [main]
  workflow_dispatch:

concurrency:
  group: deploy-${{ github.ref }}
  cancel-in-progress: true

permissions:
  contents: read
  deployments: write

jobs:
  deploy:
    if: ${{ vars.CLOUDFLARE_PROJECT_NAME != '' }}
    runs-on: ubuntu-latest
    environment:
      name: production
      url: ${{ steps.deploy.outputs.deployment-url }}
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - name: Deploy to Cloudflare Pages
        id: deploy
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy dist --project-name=${{ vars.CLOUDFLARE_PROJECT_NAME }}
```
