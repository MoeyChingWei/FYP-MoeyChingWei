import express from "express";
import prisma from "../config/prisma.js";
import { ExportService } from "../services/export-service.js";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supported data types and formats
const SUPPORTED_DATA_TYPES = ["purchase-requests", "purchase-orders", "invoices", "suppliers"];
const SUPPORTED_FORMATS = ["pdf", "excel", "csv", "json"];

/**
 * POST /api/export/:dataType
 * Export data in the requested format with filters and department-level permissions
 */
router.post("/:dataType", async (req, res) => {
  try {
    const { dataType } = req.params;
    const { format, filters = {}, userId, userRole, userDepartment } = req.body;

    // Validate dataType
    if (!SUPPORTED_DATA_TYPES.includes(dataType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid data type. Supported types: ${SUPPORTED_DATA_TYPES.join(", ")}`,
      });
    }

    // Validate format
    if (!format || !SUPPORTED_FORMATS.includes(format)) {
      return res.status(400).json({
        success: false,
        message: `Invalid format. Supported formats: ${SUPPORTED_FORMATS.join(", ")}`,
      });
    }

    // Validate user information (required for permission checks)
    if (!userId || !userRole) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Query data based on dataType with filters and permissions
    let data;
    let recordCount = 0;

    try {
      switch (dataType) {
        case "purchase-requests":
          data = await queryPurchaseRequests(filters, userRole, userDepartment);
          recordCount = data.length;
          break;

        case "purchase-orders":
          data = await queryPurchaseOrders(filters, userRole, userDepartment);
          recordCount = data.length;
          break;

        case "invoices":
          // Note: Invoices are typically derived from purchase orders
          // This is a placeholder - adjust based on actual data model
          data = await queryInvoices(filters, userRole, userDepartment);
          recordCount = data.length;
          break;

        case "suppliers":
          data = await querySuppliers(filters, userRole, userDepartment);
          recordCount = data.length;
          break;

        default:
          return res.status(400).json({
            success: false,
            message: "Unsupported data type",
          });
      }
    } catch (queryError) {
      console.error("Database query error:", queryError);
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve data",
      });
    }

    // Check if data exists
    if (!data || recordCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No records found matching the criteria",
      });
    }

    // Generate export using ExportService
    const exportService = new ExportService();
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const tempDir = path.join(process.cwd(), "temp", "exports");
    await fs.mkdir(tempDir, { recursive: true });

    try {
      // For JSON format, export all data as array
      if (format === "json") {
        const outputPath = path.join(tempDir, `${dataType}-${timestamp}.json`);
        await exportService.exportToJSON(data, outputPath);

        // Read file and stream
        const fileBuffer = await fs.readFile(outputPath);

        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${dataType}-${timestamp}.json"`
        );
        res.send(fileBuffer);

        // Clean up temp file
        await fs.unlink(outputPath);
        await exportService.close();
        return;
      }

      // For PDF, Excel, CSV - export first record as sample
      // In a real system, you might want to export multiple records or aggregate them
      if (recordCount > 1) {
        console.warn(
          `Multiple records found (${recordCount}). Exporting first record only for ${format} format.`
        );
      }

      const firstRecord = data[0];
      const dataTypeSingular = dataType.replace(/-/g, "-").slice(0, -1); // Remove trailing 's'

      let outputPath;
      let mimeType;
      let extension;

      switch (format) {
        case "pdf":
          extension = "pdf";
          mimeType = "application/pdf";
          outputPath = path.join(tempDir, `${dataType}-${timestamp}.${extension}`);
          await exportService.exportToPDF(
            dataTypeSingular,
            firstRecord,
            outputPath,
            {
              preparedBy: `User ${userId}`,
              approvedBy: userRole === "Super Admin" ? "Super Admin" : undefined,
            }
          );
          break;

        case "excel":
          extension = "xlsx";
          mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
          outputPath = path.join(tempDir, `${dataType}-${timestamp}.${extension}`);
          await exportService.exportToExcel(
            dataTypeSingular,
            firstRecord,
            outputPath,
            {
              preparedBy: `User ${userId}`,
            }
          );
          break;

        case "csv":
          extension = "csv";
          mimeType = "text/csv; charset=utf-8";
          outputPath = path.join(tempDir, `${dataType}-${timestamp}.${extension}`);
          await exportService.exportToCSV(
            dataTypeSingular,
            firstRecord,
            outputPath,
            {
              preparedBy: `User ${userId}`,
            }
          );
          break;

        default:
          await exportService.close();
          return res.status(400).json({
            success: false,
            message: "Unsupported format",
          });
      }

      // Read file and stream
      const fileBuffer = await fs.readFile(outputPath);

      res.setHeader("Content-Type", mimeType);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${dataType}-${timestamp}.${extension}"`
      );
      res.send(fileBuffer);

      // Clean up temp file
      await fs.unlink(outputPath);
      await exportService.close();
    } catch (exportError) {
      console.error("Export generation error:", exportError);
      await exportService.close();
      return res.status(500).json({
        success: false,
        message: `Failed to generate ${format} export: ${exportError.message}`,
      });
    }
  } catch (error) {
    console.error("Export API error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

/**
 * Query purchase requests with filters and department permissions
 */
async function queryPurchaseRequests(filters, userRole, userDepartment) {
  const where = {};

  // Build date filter
  if (filters.dateFrom || filters.dateTo) {
    where.createdAt = {};
    if (filters.dateFrom) {
      where.createdAt.gte = new Date(filters.dateFrom);
    }
    if (filters.dateTo) {
      where.dateTo = new Date(filters.dateTo);
      where.createdAt.lte = new Date(where.dateTo.setHours(23, 59, 59, 999));
    }
  }

  // Fetch all records and filter by payload
  const records = await prisma.purchaseRequestRecord.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  // Apply department-level permissions and filters
  return records.filter((record) => {
    const payload = record.payload;

    // Super Admin sees all, others see only their department
    if (userRole !== "Super Admin") {
      if (!userDepartment || payload.department !== userDepartment) {
        return false;
      }
    }

    // Apply status filter
    if (filters.status && payload.status !== filters.status) {
      return false;
    }

    // Apply department filter (for Super Admin)
    if (filters.department && payload.department !== filters.department) {
      return false;
    }

    return true;
  }).map(record => record.payload);
}

/**
 * Query purchase orders with filters and department permissions
 */
async function queryPurchaseOrders(filters, userRole, userDepartment) {
  const where = {};

  // Build date filter
  if (filters.dateFrom || filters.dateTo) {
    where.createdAt = {};
    if (filters.dateFrom) {
      where.createdAt.gte = new Date(filters.dateFrom);
    }
    if (filters.dateTo) {
      where.dateTo = new Date(filters.dateTo);
      where.createdAt.lte = new Date(where.dateTo.setHours(23, 59, 59, 999));
    }
  }

  // Fetch all records and filter by payload
  const records = await prisma.purchaseOrderRecord.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  // Apply department-level permissions and filters
  return records.filter((record) => {
    const payload = record.payload;

    // Super Admin sees all, others see only their department
    if (userRole !== "Super Admin") {
      if (!userDepartment || payload.department !== userDepartment) {
        return false;
      }
    }

    // Apply status filter
    if (filters.status && payload.status !== filters.status) {
      return false;
    }

    // Apply department filter (for Super Admin)
    if (filters.department && payload.department !== filters.department) {
      return false;
    }

    return true;
  }).map(record => record.payload);
}

/**
 * Query invoices with filters and department permissions
 * Note: This is a placeholder implementation
 */
async function queryInvoices(filters, userRole, userDepartment) {
  // Invoices are typically derived from purchase orders
  // This implementation treats purchase orders as invoices
  return await queryPurchaseOrders(filters, userRole, userDepartment);
}

/**
 * Query suppliers with filters and department permissions
 * Note: Suppliers are typically stored differently - adjust based on your schema
 */
async function querySuppliers(filters, userRole, userDepartment) {
  // This is a placeholder - suppliers might be stored in a separate table
  // For now, extracting unique suppliers from purchase orders
  const orders = await queryPurchaseOrders(filters, userRole, userDepartment);

  const suppliersMap = new Map();

  orders.forEach((order) => {
    if (order.supplier) {
      const supplierId = order.supplier.id || order.supplier.name;
      if (!suppliersMap.has(supplierId)) {
        suppliersMap.set(supplierId, {
          id: order.supplier.id,
          name: order.supplier.name,
          address: order.supplier.address,
          phone: order.supplier.phone,
          email: order.supplier.email,
          category: order.supplier.category,
        });
      }
    }
  });

  return Array.from(suppliersMap.values());
}

export default router;
