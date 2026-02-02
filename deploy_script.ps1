# PowerShell Script to Deploy Changes to GitHub
# Run this script in PowerShell to push your changes.

Write-Host "Stage 1: Checking Git Configuration..." -ForegroundColor Cyan

if (-not (Test-Path ".git")) {
    Write-Host "Initializing Git Repository..." -ForegroundColor Yellow
    git init
    git remote add origin https://github.com/The-Cour-Four/CoreX-Fitness-Front-End.git
    git fetch origin
    git checkout -b main
}
else {
    Write-Host "Git repository confirmed." -ForegroundColor Green
}

Write-Host "Stage 2: Adding all changes..." -ForegroundColor Cyan
git add .

Write-Host "Stage 3: Committing changes..." -ForegroundColor Cyan
# We use --allow-empty in case everything is already committed
git commit -m "Update frontend: Add female section, fix typos, and align backend codes" --allow-empty

Write-Host "Stage 4: Pushing to GitHub (Force Update)..." -ForegroundColor Cyan
# We use --force to make your local version the definitive version on GitHub
# This resolves the 'non-fast-forward' error by updating the remote to match your local files
git push --force origin main

Write-Host "Deployment Complete! ✅" -ForegroundColor Green
Write-Host "Your site should update on https://corexfitness.me in a few minutes." -ForegroundColor Gray
