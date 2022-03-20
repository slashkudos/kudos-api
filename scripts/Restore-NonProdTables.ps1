# Backup DynamoDB prod tables and restore to dev

[CmdletBinding()]
Param()

$ErrorActionPreference = "Stop"

function Invoke-BackupAndRestore {
  $tables = @(
    @{ sourceTableName = "Kudo-zw2r5gwxinglxmd3g3yvffwi2e-prod"; targetTableName = "Kudo-bu7sog55jfdeboiekpcjbz5caa-dev" }
    @{ sourceTableName = "Person-zw2r5gwxinglxmd3g3yvffwi2e-prod"; targetTableName = "Person-bu7sog55jfdeboiekpcjbz5caa-dev" }
  )

  foreach ($table in $tables) {
    # Backup source table
    $sourceBackupArn = Backup-Table $table.sourceTableName

    # Backup target table
    $targetBackupArn = Backup-Table $table.targetTableName

    # Restore target table to temp table
    $tempTableName = "$($table.targetTableName)-temp"
    Restore-Table $tempTableName $targetBackupArn

    # Drop target table
    Remove-Table $table.targetTableName

    # Restore source to target
    Restore-Table $table.targetTableName $sourceBackupArn

    Remove-Table $tempTableName
  }
}

function Backup-Table($tableName) {
  Write-Host "Starting backup for table $tableName"

  $backupSummaryJson = aws dynamodb create-backup --table-name $tableName --backup-name "$tableName-backup"
  if (!$?) { throw "Backup failed" }
  Write-Host $backupSummaryJson
  $backupSummary = $backupSummaryJson | ConvertFrom-Json

  $backupArn = $backupSummary.BackupDetails.BackupArn
  Write-Host "Backup started with ARN $backupArn"

  do {
    $backupDescribeJson = aws dynamodb describe-backup --backup-arn $backupArn
    if (!$?) { throw "Describe backup failed" }
    Write-Host $backupDescribeJson
    $backupDescribe = $backupDescribeJson | ConvertFrom-Json

    $status = $backupDescribe.BackupDescription.BackupDetails.BackupStatus
    Start-Sleep -Seconds 1
  } while ($status -eq "CREATING")

  if ($status -ne "AVAILABLE") {
    Write-Warning "Backup failed"
  }
  Write-Host "Backup complete"
  return $backupArn
}

function Restore-Table($targetTableName, $backupArn) {
  Write-Host "Starting restore for table $targetTableName"

  $restoreJson = aws dynamodb restore-table-from-backup --target-table-name $targetTableName --backup-arn $backupArn
  if (!$?) { throw "Restore failed" }
  Write-Host $restoreJson

  # Wait till done "Creating"
  do {
    $tableDescribeJson = aws dynamodb describe-table --table-name $targetTableName
    if (!$?) { throw "Describe table failed" }
    Write-Host $tableDescribeJson
    $tableDescribe = $tableDescribeJson | ConvertFrom-Json

    $status = $tableDescribe.Table.TableStatus
    
    Write-Host "Sleep 10 seconds..."
    Start-Sleep -Seconds 10
  } while ($status -eq "CREATING")

  if ($status -ne "ACTIVE") {
    Write-Warning "Restore failed with status $status"
  }
  Write-Host "Restore complete"
}

function Remove-Backup($backupArn) {
  Write-Host "Deleting backup with ARN $backupArn"
  $deleteBackupJson = aws dynamodb delete-backup --backup-arn $backupArn
  if (!$?) { throw "Delete backup failed" }
  Write-Host $deleteBackupJson
}

function Remove-Table($tableName) {
  Write-Host "Dropping table $tableName"
  $deleteTableJson = aws dynamodb delete-table --table-name $tableName
  if (!$?) { throw "Delete table failed" }
  Write-Host $deleteTableJson

  # Wait till done "Deleting"
  do {
    $tableDescribeJson = aws dynamodb describe-table --table-name $tableName

    # If the table is deleted we will get an error
    if (!$?) { break }

    Write-Host $tableDescribeJson
    $tableDescribe = $tableDescribeJson | ConvertFrom-Json
  
    $status = $tableDescribe.Table.TableStatus
    Start-Sleep -Seconds 3
  } while ($status -eq "DELETING")
  
  Write-Host "Delete complete"
}

Invoke-BackupAndRestore
