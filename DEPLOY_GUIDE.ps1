# Sapphire Unified - Deploy to GitHub + Vercel (Free Domain)
# Run this script in a NEW PowerShell window (not the agent terminal) OR paste commands manually.

Write-Host "=== Sapphire Deploy Wizard ===" -ForegroundColor Cyan
Write-Host "Local repo ready: 7c53edf on branch main (65 files committed)" -ForegroundColor Green
Write-Host ""

# Step 1: GitHub Login
Write-Host "STEP 1: GitHub Authentication" -ForegroundColor Yellow
Write-Host "Running: gh auth login --web"
Write-Host " -> Press Enter when prompted to open browser"
Write-Host " -> Copy the 8-char code (e.g. XXXX-XXXX) and paste at https://github.com/login/device"
Write-Host " -> Authorize, then return here"
Write-Host ""
gh auth login --web --skip-ssh-key --git-protocol https
if ($LASTEXITCODE -ne 0) { Write-Host "GitHub login failed or cancelled. Re-run: gh auth login --web" -ForegroundColor Red; pause; exit 1 }
gh auth status
Write-Host "✓ GitHub authenticated" -ForegroundColor Green
Write-Host ""

# Step 2: Create GitHub Repo & Push
Write-Host "STEP 2: Create GitHub repo and push" -ForegroundColor Yellow
$repoName = Read-Host "Enter GitHub repo name (default: sapphire-unified)"
if ([string]::IsNullOrWhiteSpace($repoName)) { $repoName = "sapphire-unified" }
Write-Host "Creating repo $repoName ..."
Set-Location -LiteralPath "C:\Users\Buddy Love\Downloads\Saphhire front end dev\Sapphire Unified"
gh repo create $repoName --public --source . --remote origin --push
if ($LASTEXITCODE -ne 0) {
  Write-Host "Repo create failed (maybe exists). Trying to push to existing remote..." -ForegroundColor Yellow
  git remote -v
  git push -u origin main
}
Write-Host "✓ Pushed to GitHub: https://github.com/$(gh api user -q .login)/$repoName" -ForegroundColor Green
Write-Host ""

# Step 3: Vercel Login
Write-Host "STEP 3: Vercel Authentication" -ForegroundColor Yellow
Write-Host "Running: vercel login"
Write-Host " -> Choose your login method (GitHub recommended - same as above)"
Write-Host " -> Browser will open for Vercel OAuth"
vercel login
if ($LASTEXITCODE -ne 0) { Write-Host "Vercel login failed. Re-run: vercel login" -ForegroundColor Red; pause; exit 1 }
vercel whoami
Write-Host "✓ Vercel authenticated" -ForegroundColor Green
Write-Host ""

# Step 4: Deploy to Vercel
Write-Host "STEP 4: Deploy to Vercel (free *.vercel.app domain)" -ForegroundColor Yellow
Set-Location -LiteralPath "C:\Users\Buddy Love\Downloads\Saphhire front end dev\Sapphire Unified"
Write-Host "Running: vercel --prod --yes"
vercel --prod --yes
if ($LASTEXITCODE -eq 0) {
  Write-Host "✓ Deployed! Your live URL is shown above (https://*.vercel.app)" -ForegroundColor Green
  Write-Host "You can also view in dashboard: https://vercel.com/dashboard" -ForegroundColor Cyan
} else {
  Write-Host "Deploy failed. Try: vercel --prod" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Done ===" -ForegroundColor Cyan
pause
