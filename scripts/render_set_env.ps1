<#
.SYNOPSIS
  Set Render environment variables for a service using the Render API (PowerShell).

.DESCRIPTION
  This script uses the Render HTTP API to create/update env vars for a service.
  Export the required variables before running: RENDER_SERVICE_ID, RENDER_API_KEY,
  and the values to set (MONGO_URI, JWT_SECRET, FRONTEND_URL, PORT).

.EXAMPLE
  $env:RENDER_SERVICE_ID = 'srv-xxxx'
  $env:RENDER_API_KEY = 'render_api_key_here'
  $env:MONGO_URI = 'mongodb+srv://user:pass@cluster0...'
  .\scripts\render_set_env.ps1

#>
param()

if (-not $env:RENDER_SERVICE_ID -or -not $env:RENDER_API_KEY) {
  Write-Error 'Set RENDER_SERVICE_ID and RENDER_API_KEY in your environment before running.'
  exit 2
}

$vars = @{
  MONGO_URI = $env:MONGO_URI
  JWT_SECRET = $env:JWT_SECRET
  FRONTEND_URL = $env:FRONTEND_URL
  PORT = $env:PORT
}

$apiBase = 'https://api.render.com/v1'

foreach ($k in $vars.Keys) {
  $v = $vars[$k]
  if (-not $v) {
    Write-Host "Skipping $k — value empty"
    continue
  }

  Write-Host "Setting $k via Render API..."
  $body = @{ key = $k; value = $v; scope = 'env' } | ConvertTo-Json
  try {
    $resp = Invoke-RestMethod -Method Post -Uri "$apiBase/services/$($env:RENDER_SERVICE_ID)/env-vars" -Headers @{ Authorization = "Bearer $($env:RENDER_API_KEY)" } -ContentType 'application/json' -Body $body
    Write-Host "Set $k:" ($resp | ConvertTo-Json -Depth 2)
  } catch {
    Write-Warning "Failed to set $k: $_"
  }
}

Write-Host 'Finished setting env vars. Verify in Render dashboard.'
