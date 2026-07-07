# run-backend.ps1
# Helper script to load .env variables and run the backend

if (Test-Path .env) {
    Write-Host "Loading environment variables from .env file..." -ForegroundColor Green
    Get-Content .env | ForEach-Object {
        $line = $_.Trim()
        if ($line -and -not $line.StartsWith("#")) {
            $parts = $line.Split('=', 2)
            if ($parts.Length -eq 2) {
                $key = $parts[0].Trim()
                $value = $parts[1].Trim()
                [System.Environment]::SetEnvironmentVariable($key, $value, [System.EnvironmentVariableTarget]::Process)
            }
        }
    }
} else {
    Write-Host "WARNING: .env file not found in backend directory. Falling back to default properties." -ForegroundColor Yellow
}

.\mvnw.cmd spring-boot:run
