/** Payload when a drafter submits a requisition into the workflow. */
export interface SubmitPurchaseRequestPayload {
  requisitionId: string;
  submittedById: string;
  submittedAt: Date;
}

export interface SubmissionValidationIssue {
  field: string;
  message: string;
}

export interface SubmissionResult {
  success: boolean;
  requisitionId: string;
  issues?: SubmissionValidationIssue[];
}
