type WorkflowRow = {
  status?: string;
  requestDate?: string;
  createdDate?: string;
};

function statusPriority(status: string | undefined): number {
  const normalized = String(status ?? "").trim().toUpperCase();
  if (normalized === "DRAFT") return 0;
  if (normalized.includes("PENDING") || normalized === "SUBMITTED" || normalized === "REQUEST_CHANGE") {
    return 1;
  }
  return 2;
}

export function sortWorkflowRowsByStatusAndDate<T extends WorkflowRow>(rows: T[]): T[] {
  return rows
    .map((row, index) => ({ row, index }))
    .sort((left, right) => {
      const priorityDifference = statusPriority(left.row.status) - statusPriority(right.row.status);
      if (priorityDifference !== 0) return priorityDifference;

      const leftTime = Date.parse(left.row.createdDate ?? left.row.requestDate ?? "");
      const rightTime = Date.parse(right.row.createdDate ?? right.row.requestDate ?? "");
      if (Number.isFinite(leftTime) && Number.isFinite(rightTime) && leftTime !== rightTime) {
        return rightTime - leftTime;
      }
      return right.index - left.index;
    })
    .map(({ row }) => row);
}
