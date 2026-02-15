param(
  [Parameter(Mandatory = $true)]
  [string]$ProjectRef,

  [Parameter(Mandatory = $true)]
  [string]$AccessToken,

  [string]$SupabaseUrl = "",
  [string]$AnonKey = "",
  [string]$ServiceRoleKey = ""
)

$ErrorActionPreference = "Stop"

Write-Host "[1/4] Linking Supabase project..."
$env:SUPABASE_ACCESS_TOKEN = $AccessToken
npx.cmd supabase link --project-ref $ProjectRef

Write-Host "[2/4] Pushing migrations to Supabase Cloud..."
npx.cmd supabase db push

if ($SupabaseUrl -and $AnonKey) {
  Write-Host "[3/4] Updating .env.local for Next.js app..."
  @"
NEXT_PUBLIC_SUPABASE_URL=$SupabaseUrl
NEXT_PUBLIC_SUPABASE_ANON_KEY=$AnonKey
SUPABASE_SERVICE_ROLE_KEY=$ServiceRoleKey
"@ | Set-Content .env.local
}

Write-Host "[4/4] Done."
Write-Host "Run app with: npm.cmd run dev"
