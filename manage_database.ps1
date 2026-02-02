# Standup Coder Database Management Script

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("stats", "help")]
    [string]$Action = "help"
)

function Show-Help {
    Write-Host "Standup Coder Database Management Tool" -ForegroundColor Green
    Write-Host "======================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Usage: .\manage_database.ps1 -Action <action>" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Available actions:" -ForegroundColor Cyan
    Write-Host "  stats    - Show database statistics" -ForegroundColor White
    Write-Host "  help     - Show this help message" -ForegroundColor White
    Write-Host ""
    Write-Host "Example:" -ForegroundColor Cyan
    Write-Host "  .\manage_database.ps1 -Action stats" -ForegroundColor White
}

function Show-Statistics {
    $listDir = Join-Path $PSScriptRoot "list"
    
    if (-not (Test-Path $listDir)) {
        Write-Error "List directory not found: $listDir"
        return
    }
    
    $files = Get-ChildItem -Path $listDir -Filter "*.md"
    $totalFiles = ($files | Measure-Object).Count
    
    Write-Host "Database Statistics" -ForegroundColor Green
    Write-Host "===================" -ForegroundColor Green
    Write-Host "Total files: $totalFiles" -ForegroundColor Cyan
    
    # Count by category
    $aiCount = ($files | Where-Object { $_.Name -like "ai-*" }).Count
    $bigdataCount = ($files | Where-Object { $_.Name -like "bigdata-*" }).Count
    $cloudCount = ($files | Where-Object { $_.Name -like "cloud-*" }).Count
    $securityCount = ($files | Where-Object { $_.Name -like "security-*" }).Count
    
    Write-Host ""
    Write-Host "By Category:" -ForegroundColor Cyan
    if ($aiCount -gt 0) { Write-Host "  AI: $aiCount files" -ForegroundColor White }
    if ($bigdataCount -gt 0) { Write-Host "  Big Data: $bigdataCount files" -ForegroundColor White }
    if ($cloudCount -gt 0) { Write-Host "  Cloud Computing: $cloudCount files" -ForegroundColor White }
    if ($securityCount -gt 0) { Write-Host "  Security: $securityCount files" -ForegroundColor White }
    
    # Top cities
    Write-Host ""
    Write-Host "Top Cities (by file count):" -ForegroundColor Cyan
    $cityStats = @{}
    
    foreach ($file in $files) {
        if ($file.Name -match "\-([a-z]+)\.md$") {
            $city = $matches[1]
            if ($cityStats.ContainsKey($city)) {
                $cityStats[$city]++
            } else {
                $cityStats[$city] = 1
            }
        }
    }
    
    $cityStats.GetEnumerator() | Sort-Object Value -Descending | Select-Object -First 5 | ForEach-Object {
        Write-Host "  $($_.Key): $($_.Value) files" -ForegroundColor White
    }
}

# Main logic
switch ($Action) {
    "help" { Show-Help }
    "stats" { Show-Statistics }
    default { Show-Help }
}