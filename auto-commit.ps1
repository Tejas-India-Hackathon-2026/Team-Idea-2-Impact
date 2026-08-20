# LocalKart Automatic Git Commit Watcher Script
# Automatically detects file changes every 5 seconds and creates formatted commits:
# "Auto Commit #N - <short description>"

$ProjectDir = $PSScriptRoot
if (-not $ProjectDir) {
    $ProjectDir = Get-Location
}
Set-Location -Path $ProjectDir

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host " LocalKart Automatic Git Commit Watcher" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "Project Directory: $ProjectDir" -ForegroundColor Yellow

# Ensure Git repository exists
$isGitRepo = git rev-parse --is-inside-work-tree 2>$null
if ($isGitRepo -ne "true") {
    Write-Host "[AutoCommit] Initializing Git repository..." -ForegroundColor Yellow
    git init
} else {
    Write-Host "[AutoCommit] Git repository active." -ForegroundColor Green
}

# Display remote origin if configured
$originUrl = git remote get-url origin 2>$null
if ($originUrl) {
    Write-Host "[AutoCommit] Remote origin: $originUrl" -ForegroundColor Green
} else {
    Write-Host "[AutoCommit] Remote origin: (None configured)" -ForegroundColor Gray
}

Write-Host "[AutoCommit] Monitoring changes every 5 seconds..." -ForegroundColor Cyan
Write-Host "[AutoCommit] Press Ctrl+C to stop auto-committing." -ForegroundColor Yellow
Write-Host "--------------------------------------------------" -ForegroundColor Cyan

while ($true) {
    try {
        # Check for uncommitted changes (respecting .gitignore rules)
        $statusLines = git status --porcelain
        if ($statusLines) {
            # Stage all changes matching .gitignore
            git add .

            # Check staged files
            $stagedFiles = @(git diff --cached --name-only)
            if ($stagedFiles -and $stagedFiles.Count -gt 0 -and $stagedFiles[0] -ne "") {
                # Generate a short, meaningful description of changed files
                $fileNames = @()
                foreach ($f in $stagedFiles) {
                    if ($f) {
                        $base = [System.IO.Path]::GetFileName($f.ToString())
                        if ($base) { $fileNames += $base }
                    }
                }
                $uniqueNames = @($fileNames | Select-Object -Unique)

                if ($uniqueNames.Count -eq 1) {
                    $description = "Update $($uniqueNames[0])"
                } elseif ($uniqueNames.Count -le 3) {
                    $description = "Update " + ($uniqueNames -join ", ")
                } else {
                    $description = "Update $($uniqueNames.Count) files ($($uniqueNames[0..1] -join ', '), ...)"
                }

                # Auto-increment commit number #N
                $commitCount = [int](git rev-list --count HEAD 2>$null)
                $nextNum = $commitCount + 1

                $commitMsg = "Auto Commit #$nextNum - $description"
                $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

                Write-Host "[$timestamp] Creating commit: '$commitMsg'" -ForegroundColor Yellow
                git commit -m $commitMsg

                if ($LASTEXITCODE -eq 0) {
                    Write-Host "[$timestamp] Successfully created commit #$nextNum" -ForegroundColor Green
                }
            }
        }
    }
    catch {
        Write-Host "[AutoCommit Error] $($_.Exception.Message)" -ForegroundColor Red
    }

    Start-Sleep -Seconds 5
}
