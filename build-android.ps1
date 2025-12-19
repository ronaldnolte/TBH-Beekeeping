$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:PATH = "$env:PATH;C:\Users\ronno\AppData\Local\Android\Sdk\platform-tools"

Write-Host "Environment Configured."
Write-Host "Java: $env:JAVA_HOME"
Write-Host "Running Gradle with diagnostics..."

Set-Location apps\mobile\android
.\gradlew.bat assembleDebug --stacktrace
