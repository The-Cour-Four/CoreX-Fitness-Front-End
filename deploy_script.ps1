# PowerShell Script to Deploy Changes to GitHub
# Run this script in PowerShell to push your changes.

Write-Host "Stage 1: Checking Git Configuration..." -ForegroundColor Cyan

if (-not (Test-Path ".git")) {
    Write-Host "Initializing Git Repository..." -ForegroundColor Yellow
    git init
    git remote add origin https://github.com/The-Cour-Four/CoreX-Fitness-Front-End.git
}

# Ensure we have the remote info
git fetch origin

# Switch to Main3.0 branch (Create/Reset it)
Write-Host "Switching to branch Main3.0..." -ForegroundColor Cyan
git checkout -B Main3.0

Write-Host "Stage 2: Adding all changes..." -ForegroundColor Cyan
git add .

Write-Host "Stage 3: Committing changes..." -ForegroundColor Cyan
# We use --allow-empty in case everything is already committed
git commit -m "Update frontend: Add female section, fix typos, and align backend codes" --allow-empty

Write-Host "Stage 4: Pushing to GitHub (Force Update to Main3.0)..." -ForegroundColor Cyan
# Force push to Main3.0
git push --force origin Main3.0

Write-Host "Deployment Complete! ✅" -ForegroundColor Green
Write-Host "Your site should update on https://corexfitness.me in a few minutes." -ForegroundColor Gray
