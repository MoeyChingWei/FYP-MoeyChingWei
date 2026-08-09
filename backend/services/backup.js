import prisma from "../config/prisma.js";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";

const execAsync = promisify(exec);

/**
 * Backup Service
 * Handles automated database and file backups
 */

class BackupService {
  constructor() {
    this.backupDir = path.join(process.cwd(), "backups");
    this.ensureBackupDir();
  }

  async ensureBackupDir() {
    try {
      await fs.mkdir(this.backupDir, { recursive: true });
      await fs.mkdir(path.join(this.backupDir, "database"), { recursive: true });
      await fs.mkdir(path.join(this.backupDir, "files"), { recursive: true });
    } catch (error) {
      console.error("❌ [BACKUP] Failed to create backup directories:", error.message);
    }
  }

  /**
   * Backup PostgreSQL database
   */
  async backupDatabase() {
    const startedAt = new Date();
    const timestamp = startedAt.toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const fileName = `db_backup_${timestamp}.sql`;
    const filePath = path.join(this.backupDir, "database", fileName);

    let backupRecord = null;

    try {
      // Create backup history record
      backupRecord = await prisma.backupHistory.create({
        data: {
          backupType: "DATABASE",
          fileName,
          filePath,
          status: "IN_PROGRESS",
          startedAt,
        },
      });

      // Get database connection info from environment
      const dbUrl = process.env.DATABASE_URL;
      if (!dbUrl) {
        throw new Error("DATABASE_URL not found in environment");
      }

      // Parse connection string
      const url = new URL(dbUrl);
      const host = url.hostname;
      const port = url.port || "5432";
      const database = url.pathname.slice(1);
      const username = url.username;
      const password = url.password;

      // Construct pg_dump command
      const dumpCommand = `"C:\\Program Files\\PostgreSQL\\18\\bin\\pg_dump.exe" -h ${host} -p ${port} -U ${username} -d ${database} -F p -f "${filePath}"`;

      console.log(`🔄 [BACKUP] Starting database backup: ${fileName}`);

      // Execute backup
      const env = { ...process.env, PGPASSWORD: password };
      await execAsync(dumpCommand, { env, maxBuffer: 1024 * 1024 * 100 });

      // Get file size
      const stats = await fs.stat(filePath);
      const fileSize = stats.size;

      // Get row counts for metadata
      const rowCounts = await this.getRowCounts();

      // Update backup record
      await prisma.backupHistory.update({
        where: { id: backupRecord.id },
        data: {
          status: "SUCCESS",
          completedAt: new Date(),
          fileSize: BigInt(fileSize),
          metadata: { rowCounts },
        },
      });

      console.log(`✅ [BACKUP] Database backup completed: ${fileName} (${this.formatBytes(fileSize)})`);

      return {
        success: true,
        fileName,
        filePath,
        fileSize,
        rowCounts,
      };
    } catch (error) {
      console.error("❌ [BACKUP] Database backup failed:", error.message);

      if (backupRecord) {
        await prisma.backupHistory.update({
          where: { id: backupRecord.id },
          data: {
            status: "FAILED",
            completedAt: new Date(),
            errorMsg: error.message,
          },
        });
      }

      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Backup uploaded files
   */
  async backupFiles() {
    const startedAt = new Date();
    const timestamp = startedAt.toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const fileName = `files_backup_${timestamp}.zip`;
    const filePath = path.join(this.backupDir, "files", fileName);

    let backupRecord = null;

    try {
      backupRecord = await prisma.backupHistory.create({
        data: {
          backupType: "FILES",
          fileName,
          filePath,
          status: "IN_PROGRESS",
          startedAt,
        },
      });

      const uploadsDir = path.join(process.cwd(), "uploads");

      // Check if uploads directory exists
      try {
        await fs.access(uploadsDir);
      } catch {
        console.log("⚠️ [BACKUP] No uploads directory found, skipping file backup");
        await prisma.backupHistory.update({
          where: { id: backupRecord.id },
          data: {
            status: "SUCCESS",
            completedAt: new Date(),
            fileSize: BigInt(0),
            metadata: { message: "No files to backup" },
          },
        });
        return { success: true, message: "No files to backup" };
      }

      console.log(`🔄 [BACKUP] Starting files backup: ${fileName}`);

      // Use PowerShell to create zip
      const zipCommand = `Compress-Archive -Path "${uploadsDir}\\*" -DestinationPath "${filePath}" -Force`;
      await execAsync(zipCommand, { shell: "powershell.exe", maxBuffer: 1024 * 1024 * 100 });

      const stats = await fs.stat(filePath);
      const fileSize = stats.size;

      // Count files in uploads
      const files = await fs.readdir(uploadsDir, { recursive: true });
      const fileCount = files.filter(f => !f.includes("\\.")).length;

      await prisma.backupHistory.update({
        where: { id: backupRecord.id },
        data: {
          status: "SUCCESS",
          completedAt: new Date(),
          fileSize: BigInt(fileSize),
          metadata: { fileCount },
        },
      });

      console.log(`✅ [BACKUP] Files backup completed: ${fileName} (${this.formatBytes(fileSize)}, ${fileCount} files)`);

      return {
        success: true,
        fileName,
        filePath,
        fileSize,
        fileCount,
      };
    } catch (error) {
      console.error("❌ [BACKUP] Files backup failed:", error.message);

      if (backupRecord) {
        await prisma.backupHistory.update({
          where: { id: backupRecord.id },
          data: {
            status: "FAILED",
            completedAt: new Date(),
            errorMsg: error.message,
          },
        });
      }

      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Full backup (database + files)
   */
  async fullBackup() {
    console.log("🚀 [BACKUP] Starting full backup...");

    const [dbResult, filesResult] = await Promise.all([
      this.backupDatabase(),
      this.backupFiles(),
    ]);

    return {
      success: dbResult.success && filesResult.success,
      database: dbResult,
      files: filesResult,
    };
  }

  /**
   * Get row counts for all tables
   */
  async getRowCounts() {
    const counts = {};

    try {
      counts.users = await prisma.user.count();
      counts.notifications = await prisma.notification.count();
      counts.auditLogs = await prisma.auditLog.count();
      counts.purchaseRequests = await prisma.purchaseRequestRecord.count();
      counts.purchaseOrders = await prisma.purchaseOrderRecord.count();
      counts.chatSessions = await prisma.chatSession.count();
      counts.chatMessages = await prisma.chatMessage.count();
      counts.sources = await prisma.source.count();
    } catch (error) {
      console.error("❌ [BACKUP] Failed to get row counts:", error.message);
    }

    return counts;
  }

  /**
   * Get backup history
   */
  async getHistory(limit = 20, backupType = null) {
    const where = {};
    if (backupType) where.backupType = backupType;

    return await prisma.backupHistory.findMany({
      where,
      orderBy: { startedAt: "desc" },
      take: limit,
    });
  }

  /**
   * Clean old backups (keep last N)
   */
  async cleanOldBackups(keepLast = 10) {
    try {
      const allBackups = await prisma.backupHistory.findMany({
        orderBy: { startedAt: "desc" },
      });

      const toDelete = allBackups.slice(keepLast);

      for (const backup of toDelete) {
        try {
          await fs.unlink(backup.filePath);
          await prisma.backupHistory.delete({ where: { id: backup.id } });
          console.log(`🗑️ [BACKUP] Deleted old backup: ${backup.fileName}`);
        } catch (error) {
          console.error(`❌ [BACKUP] Failed to delete backup ${backup.fileName}:`, error.message);
        }
      }

      return { deleted: toDelete.length };
    } catch (error) {
      console.error("❌ [BACKUP] Cleanup failed:", error.message);
      return { deleted: 0, error: error.message };
    }
  }

  /**
   * Format bytes to human readable
   */
  formatBytes(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  }
}

export default new BackupService();
