# Diagram Pack for PlantUML

This folder contains diagrams checked against the current React frontend, Express backend and Prisma workflow stores.

## Final Activity Diagram Set

The final activity set contains **26 small diagrams**. Each one is intentionally limited to one user goal or one status transition, so it can be rendered and read on a single report page.

### Authentication and access

1. `activity-01-authentication-rbac.puml` - Login, role/department evaluation, Finance hiding and Manager Overview card hiding.
2. `activity-02-password-reset.puml` - Forgot-password request, reset code, expiry and password update.
3. `activity-03-profile-management.puml` - Profile update, avatar upload and password change.
4. `activity-04-admin-user-role-management.puml` - Admin creates, edits and deactivates users.

### Purchase request and purchase order

5. `activity-05-purchase-request-draft.puml` - Create a request and save a local/remote draft.
6. `activity-06-purchase-request-submit.puml` - Validate, reserve department budget and submit.
7. `activity-07-purchase-request-routing.puml` - Select the correct approver from requester role and department.
8. `activity-08-purchase-request-review.puml` - Approve, request change or reject with budget and notification effects.
9. `activity-09-purchase-order-executive-review.puml` - Build the PO draft and submit it to Manager.
10. `activity-10-purchase-order-manager-approval.puml` - Manager approves or rejects the PO.

### Supplier fulfilment and finance

11. `activity-11-supplier-order-acknowledgement.puml` - Supplier accepts or rejects an approved PO.
12. `activity-12-supplier-delivery.puml` - Supplier submits dispatch and delivery information.
13. `activity-13-grn-verification.puml` - Requester verifies goods, records GRN and repeats discrepancy delivery.
14. `activity-14-supplier-invoice-submission.puml` - Supplier submits an invoice against a completed GRN.
15. `activity-15-finance-invoice-approval.puml` - Treasury/Finance Officer validates and approves or rejects invoice.
16. `activity-16-payment-processing.puml` - Payment Team marks an approved invoice as paid with proof.

### Budget management

17. `activity-17-budget-forecasting.puml` - Aggregate approved requests and calculate next-period forecast.
18. `activity-18-next-month-budget-submission.puml` - Department submits a next-month budget proposal.
19. `activity-19-budget-adjustment-approval.puml` - Finance approves or rejects a budget adjustment.

### Shared and administrative functions

20. `activity-20-notification-management.puml` - Fetch, open, mark-read, delete and clean notifications.
21. `activity-21-feedback-and-admin-review.puml` - User submits feedback and triggers Admin notification.
22. `activity-22-ai-assistant.puml` - AI question, optional document upload, provider response and retry.
23. `activity-23-master-data-and-supplier-settings.puml` - Admin maintains departments, roles, categories, units and payment terms.
24. `activity-24-admin-operations.puml` - Audit log, data export and database backup.
25. `activity-25-feedback-admin-review.puml` - Admin filters, reviews and updates feedback status.
26. `activity-26-supplier-settings.puml` - Supplier updates tax and protected payment details.

The old unnumbered activity files are retained as reference material. In particular, `activity-purchasing-full-flow-detailed.puml` and `activity-purchasing-swimlane.puml` are overview diagrams; do not use them as the detailed final diagram because the flow is intentionally too large for one page.

## Supporting Diagram Set

There are **15 supporting diagrams**, making **41 recommended diagrams** for the report when combined with the 26 final activity diagrams:

- `erd-system.puml` - Physical ERD using database foreign keys.
- `erd-logical-workflow.puml` - Logical workflow relationships carried in JSON/local IDs.
- `system-architecture.puml` - Frontend pages/modules and backend route groups.
- `logic-modeling.puml` - Access, workflow, budget, feedback and notification rules.
- `sequence-login.puml` - Login validation, role redirect and failure paths.
- `sequence-feedback-notify.puml` - Feedback creation and Admin notification persistence.
- `sequence-request-approval-to-po.puml` - Request approval, PO generation and Manager handoff.
- `sequence-supplier-delivery-grn-discrepancy.puml` - Delivery, GRN checking and resend loop.
- `sequence-finance-invoice-payment.puml` - Supplier invoice review and payment processing.
- `sequence-budget-forecast-adjustment.puml` - Forecast, department proposal and Finance review.
- `use-case-system.puml` - Role-based system use cases.
- `state-purchase-workflow.puml` - Request-to-PO-to-delivery-to-GRN state transitions.
- `dfd-level0.puml` - Level-0 data flow across actors, processes and stores.
- `component-system.puml` - Component-to-page and route mapping.
- `deployment-system.puml` - Browser, frontend/API server, Prisma/PostgreSQL, uploads and Gmail/SMTP deployment.

## Rendering Guidance

- Use one numbered activity diagram per report page or presentation slide.
- Use the supporting diagrams for architecture, data, interactions and deployment context.
- Keep the overview/legacy activity diagrams only when a high-level end-to-end picture is needed.
- PlantUML can render each `.puml` file independently.
