# 批量为所有markdown文件添加财报信息

$listDir = "c:\Users\Allen\Documents\GitHub\the-big-list\list"
$files = Get-ChildItem -Path $listDir -Filter "*.md"

foreach ($file in $files) {
    Write-Host "Processing $($file.Name)..."
    
    try {
        $content = Get-Content -Path $file.FullName -Encoding UTF8 -Raw
        
        # 检查文件是否包含企业列表表格
        if ($content -match '\|\s*企业名称\s*\|') {
            # 添加财报列到表头
            $content = $content -replace '(\|\s*企业名称\s*\|.*?)(\|\s*法律风险\s*\|)', '$1| 财报 |$2'
            
            # 添加分隔符
            $content = $content -replace '(\|----------\|.*?)(\|----------\|)', '$1|----------|$2'
            
            # 为已上市企业添加财报链接
            # 纳斯达克上市
            $content = $content -replace '(\|.*?纳斯达克.*?\|.*?)(\|\s*法律风险\s*\|)', '$1| [公司财报](https://ir.nasdaq.com) |$2'
            # 港交所上市
            $content = $content -replace '(\|.*?港交所.*?\|.*?)(\|\s*法律风险\s*\|)', '$1| [港交所公告](https://www.hkex.com.hk) |$2'
            # 科创板上市
            $content = $content -replace '(\|.*?科创板.*?\|.*?)(\|\s*法律风险\s*\|)', '$1| [上交所公告](http://www.sse.com.cn/disclosure/listedinfo/regular/) |$2'
            # 深交所上市
            $content = $content -replace '(\|.*?深交所.*?\|.*?)(\|\s*法律风险\s*\|)', '$1| [深交所公告](http://www.szse.cn/disclosure/listed/fixed/index.html) |$2'
            # 已上市企业
            $content = $content -replace '(\|.*?已上市.*?\|.*?)(\|\s*法律风险\s*\|)', '$1| [公司财报](https://example.com) |$2'
            # 未上市企业
            $content = $content -replace '(\|.*?未上市.*?\|.*?)(\|\s*法律风险\s*\|)', '$1| 未公开 |$2'
            
            # 保存修改
            Set-Content -Path $file.FullName -Value $content -Encoding UTF8
            Write-Host "Updated $($file.Name)"
        } else {
            Write-Host "No company table found in $($file.Name)"
        }
    } catch {
        Write-Host "Error processing $($file.Name): $($_.Exception.Message)"
    }
}

Write-Host "All files processed."
