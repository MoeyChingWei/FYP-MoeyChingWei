/** Item in a reviewer’s queue (pre-approval scrutiny). */
export interface PurchaseRequestReviewTask {
  requisitionId: string;
  title: string;
  assignedReviewerId: string;
  priority: "normal" | "high";
  dueAt?: Date;
}

export interface ReviewComment {
  id: string;
  requisitionId: string;
  authorId: string;
  body: string;
  createdAt: Date;
}
