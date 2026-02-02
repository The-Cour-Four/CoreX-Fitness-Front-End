# PowerShell Script to Deploy Changes to GitHub
# Run this script in PowerShell to push your changes.

Write-Host "Stage 1: Checking Git Configuration..." -ForegroundColor Cyan

if (-not (Test-Path ".git")) {
    Write-Host "Initializing Git Repository..." -ForegroundColor Yellow
    git init
    git remote add origin https://github.com/The-Cour-Four/CoreX-Fitness-Front-End.git
    git fetch origin
    # Switch to main branch if getting checkout error, try 'main' or 'master'
    git checkout -b main
} else {
    Write-Host "Git repository confirmed." -ForegroundColor Green
}

Write-Host "Stage 2: Adding all changes..." -ForegroundColor Cyan
git add .

Write-Host "Stage 3: Committing changes..." -ForegroundColor Cyan
git commit -m "Add female frontend, fix verification syntax, and correct file naming typos"

Write-Host "Stage 4: Pushing to GitHub..." -ForegroundColor Cyan
# Push to main branch. If it fails due to conflicts, force push might be needed but standard push is safer first.
git push -u origin main

Write-Host "Deployment Complete! ✅" -ForegroundColor Green
Write-Host "Your site should update on https://corexfitness.me in a few minutes." -ForegroundColor Gray
