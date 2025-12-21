# Fix AndroidManifest.xml to remove portrait-only orientation
$manifestPath = "android\app\src\main\AndroidManifest.xml"
$content = Get-Content $manifestPath -Raw
$content = $content -replace ' android:screenOrientation="portrait"', ''
Set-Content $manifestPath -Value $content -NoNewline
Write-Host "SUCCESS: Removed portrait-only orientation lock from AndroidManifest.xml"
