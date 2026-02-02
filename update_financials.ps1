# 批量为所有markdown文件添加财报信息

$listDir = "c:\Users\Allen\Documents\GitHub\the-big-list\list"
$files = Get-ChildItem -Path $listDir -Filter "*.md"

$processed = 0
$errors = 0

foreach ($file in $files) {
    Write-Host "Processing: $($file.Name)"
    
    try {
        $content = Get-Content -Path $file.FullName -Encoding UTF8
        $modified = $false
        
        # 处理每一行
        for ($i = 0; $i -lt $content.Length; $i++) {
            $line = $content[$i]
            
            # 添加财报列到表头
            if ($line -match '\|\s*企业名称\s*\|' -and $line -notmatch '\|\s*财报\s*\|') {
                $content[$i] = $line -replace '(\|\s*法律风险\s*\|)', '| 财报 |$1'
                $modified = $true
            }
            
            # 添加分隔符
            elseif ($line -match '\|----------\|' -and $content[$i-1] -match '\|\s*企业名称\s*\|') {
                $content[$i] = $line -replace '(\|----------\|)$', '|----------|$1'
                $modified = $true
            }
            
            # 为企业添加财报信息
            elseif ($line -match '\|.*\|.*\|.*\|.*\|.*\|.*\|.*\|.*\|.*\|.*\|.*\|.*\|.*\|.*\|.*\|\s*法律风险\s*\|') {
                # 检查是否已经添加了财报信息
                if ($line -notmatch '\|\s*(财报|未公开|\[.*?\]\(.*?\))\s*\|$') {
                    # 根据上市状态添加财报信息
                    if ($line -match '纳斯达克') {
                        $content[$i] = $line -replace '(\|\s*法律风险\s*\|)', '| [公司财报](https://ir.nasdaq.com) |'
                    }
                    elseif ($line -match '港交所') {
                        $content[$i] = $line -replace '(\|\s*法律风险\s*\|)', '| [港交所公告](https://www.hkex.com.hk) |'
                    }
                    elseif ($line -match '科创板') {
                        $content[$i] = $line -replace '(\|\s*法律风险\s*\|)', '| [上交所公告](http://www.sse.com.cn/disclosure/listedinfo/regular/) |'
                    }
                    elseif ($line -match '深交所') {
                        $content[$i] = $line -replace '(\|\s*法律风险\s*\|)', '| [深交所公告](http://www.szse.cn/disclosure/listed/fixed/index.html) |'
                    }
                    elseif ($line -match '已上市') {
                        $content[$i] = $line -replace '(\|\s*法律风险\s*\|)', '| [公司财报](https://example.com) |'
                    }
                    elseif ($line -match '未上市') {
                        $content[$i] = $line -replace '(\|\s*法律风险\s*\|)', '| 未公开 |'
                    }
                    $modified = $true
                }
            }
        }
        
        if ($modified) {
            Set-Content -Path $file.FullName -Value $content -Encoding UTF8
            Write-Host "Updated: $($file.Name)"
            $processed++
        } else {
            Write-Host "No changes needed: $($file.Name)"
        }
    } catch {
        Write-Host "Error: $($_.Exception.Message)"
        $errors++
    }
}

Write-Host ""
Write-Host "=== SUMMARY ==="
Write-Host "Files processed: $processed"
Write-Host "Files with errors: $errors"
Write-Host "Total files: $($files.Count)"
