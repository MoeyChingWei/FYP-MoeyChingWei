param(
  [string]$DatabaseName = "FYPData",
  [string]$DbUser = "postgres",
  [string]$DbHost = "localhost",
  [int]$DbPort = 5432,
  [string]$ProjectRoot = $PSScriptRoot
)

$ErrorActionPreference = "Stop"

function Resolve-PostgresTool {
  param([string]$ToolName)

  $command = Get-Command $ToolName -ErrorAction SilentlyContinue
  if ($command) {
    return $command.Source
  }

  $postgresRoot = "C:\Program Files\PostgreSQL"
  if (Test-Path $postgresRoot) {
    $match = Get-ChildItem $postgresRoot -Directory |
      Sort-Object Name -Descending |
      ForEach-Object { Join-Path $_.FullName "bin\$ToolName.exe" } |
      Where-Object { Test-Path $_ } |
      Select-Object -First 1

    if ($match) {
      return $match
    }
  }

  throw "Cannot find $ToolName. Install PostgreSQL client tools or add PostgreSQL\bin to PATH."
}

$ProjectRoot = (Resolve-Path $ProjectRoot).Path
$ProjectName = Split-Path $ProjectRoot -Leaf
$ExportRoot = Split-Path $ProjectRoot -Parent
$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$BackupFileName = "${DatabaseName}_backup.sql"
$BackupPath = Join-Path $ProjectRoot $BackupFileName
$TempExportRoot = Join-Path $ExportRoot "${ProjectName}-export-$Timestamp"
$ZipPath = Join-Path $ExportRoot "${ProjectName}-export-$Timestamp.zip"

Write-Host "Project: $ProjectRoot"
Write-Host "Database: $DatabaseName on ${DbHost}:${DbPort}"
Write-Host ""

$pgDump = Resolve-PostgresTool "pg_dump"

Write-Host "Step 1/4: Backing up PostgreSQL database..."
& $pgDump -U $DbUser -h $DbHost -p $DbPort -d $DatabaseName -F p -f $BackupPath
if ($LASTEXITCODE -ne 0) {
  throw "pg_dump failed with exit code $LASTEXITCODE."
}

$backup = Get-Item $BackupPath
if ($backup.Length -le 0) {
  throw "Backup file was created but is empty: $BackupPath"
}
Write-Host "Backup created: $BackupPath ($([math]::Round($backup.Length / 1MB, 2)) MB)"
Write-Host ""

Write-Host "Step 2/4: Copying project without heavy generated folders..."
if (Test-Path $TempExportRoot) {
  Remove-Item -Recurse -Force $TempExportRoot
}

$excludedDirs = @(
  "node_modules",
  "dist",
  "build",
  ".next",
  ".turbo",
  "coverage"
)

$excludedFiles = @(
  "*.log",
  "*.tmp"
)

& robocopy $ProjectRoot $TempExportRoot /E /XD $excludedDirs /XF $excludedFiles /NFL /NDL /NJH /NJS /NP
$robocopyExitCode = $LASTEXITCODE
if ($robocopyExitCode -ge 8) {
  throw "robocopy failed with exit code $robocopyExitCode."
}
Write-Host "Project copy ready: $TempExportRoot"
Write-Host ""

Write-Host "Step 3/4: Checking important files..."
$requiredFiles = @(
  (Join-Path $TempExportRoot $BackupFileName),
  (Join-Path $TempExportRoot "backend\.env"),
  (Join-Path $TempExportRoot "client\.env"),
  (Join-Path $TempExportRoot "backend\prisma\schema.prisma")
)

foreach ($file in $requiredFiles) {
  if (-not (Test-Path $file)) {
    throw "Missing required file in export: $file"
  }
}
Write-Host "Required files found."
Write-Host ""

Write-Host "Step 4/4: Creating zip..."
if (Test-Path $ZipPath) {
  Remove-Item -Force $ZipPath
}
Compress-Archive -Path (Join-Path $TempExportRoot "*") -DestinationPath $ZipPath -Force
Remove-Item -Recurse -Force $TempExportRoot

$zip = Get-Item $ZipPath
Write-Host ""
Write-Host "Done!"
Write-Host "Zip file: $ZipPath ($([math]::Round($zip.Length / 1MB, 2)) MB)"
Write-Host ""
Write-Host "Move this zip to the new laptop, then restore the database from $BackupFileName."
