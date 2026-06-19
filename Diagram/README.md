# Diagram Pack for PlantUML

This folder contains detailed PlantUML diagrams based on the current project structure (`client` + `backend` + `prisma`).

## Activity Diagram Count

You now have **16 activity diagrams** (overview + detailed):

1. `activity-login.puml`
2. `activity-workflow-storage-sync.puml`
3. `activity-feedback-submit.puml`
4. `activity-purchasing-swimlane.puml`
5. `activity-login-detailed.puml`
6. `activity-forgot-reset-password-detailed.puml`
7. `activity-profile-management-detailed.puml`
8. `activity-purchase-request-detailed.puml`
9. `activity-purchase-order-detailed.puml`
10. `activity-supplier-fulfillment-detailed.puml`
11. `activity-notification-management-detailed.puml`
12. `activity-feedback-detailed.puml`
13. `activity-purchase-request-draft-rewrite.puml`
14. `activity-request-approved-by-executive.puml`
15. `activity-purchasing-full-flow-detailed.puml`
16. `activity-logout-detailed.puml`

## What Each Activity Diagram Means

- `activity-login.puml`: User login and profile access flow.
- `activity-workflow-storage-sync.puml`: Workflow rows fetch/update flow and notification trigger.
- `activity-feedback-submit.puml`: Feedback submission flow and admin notification.
- `activity-purchasing-swimlane.puml`: End-to-end overview aligned to Requester, Executive, Manager, Supplier roles and notification logic.
- `activity-login-detailed.puml`: Full login validation, account status checks, and role redirect.
- `activity-forgot-reset-password-detailed.puml`: End-to-end forgot/reset password with verification code.
- `activity-profile-management-detailed.puml`: Profile read/update and avatar upload flow.
- `activity-purchase-request-detailed.puml`: Part 1 submit flow from requester input to review-list entry.
- `activity-purchase-request-draft-rewrite.puml`: Part 2 draft rewrite flow with optional submit path.
- `activity-purchase-order-detailed.puml`: Executive PO review and manager approval with requester/supplier notification outcomes.
- `activity-supplier-fulfillment-detailed.puml`: Supplier acknowledgement, delivery, and GRN progression.
- `activity-notification-management-detailed.puml`: Notification read, mark-all, delete, and cleanup flow.
- `activity-feedback-detailed.puml`: Feedback submission and admin review visibility flow.
- `activity-request-approved-by-executive.puml`: Executive approval/rejection detail with reason notifications and PO draft handoff.
- `activity-purchasing-full-flow-detailed.puml`: Full end-to-end business flow from request submission to supplier delivery and discrepancy resend loop.
- `activity-logout-detailed.puml`: Logout flow from sign out action to session clear and login redirection.

## Full Diagram List

- `erd-system.puml`: Physical ERD (only real DB relationships / FK-based links).
- `erd-logical-workflow.puml`: Logical ERD for workflow relationships (business flow links in payload/localId).
- `system-architecture.puml`: Detailed architecture with frontend pages/widgets/modules and backend route groups.
- `logic-modeling.puml`: Access, workflow, feedback, and notification rule responsibilities.
- `sequence-login.puml`: Login with validation, role-based redirect, and failure paths.
- `sequence-feedback-notify.puml`: Feedback creation and admin in-app notification persistence.
- `sequence-request-approval-to-po.puml`: Request submission, executive approval, PO draft generation, and manager handoff.
- `sequence-supplier-delivery-grn-discrepancy.puml`: Supplier acknowledgement/delivery, requester GRN check, and discrepancy resend loop.
- `use-case-system.puml`: Detailed role-based use cases including tracking and GRN status checks.
- `state-purchase-workflow.puml`: Request-to-PO-to-delivery-to-GRN lifecycle transitions.
- `dfd-level0.puml`: Detailed Level-0 data flow across actors, processes, and data stores.
- `component-system.puml`: Component mapping aligned to current pages and route modules.
- `deployment-system.puml`: Runtime topology including React app, Express API, Prisma client, DB, uploads, and mail.

You can copy any `.puml` file content directly into [PlantUML](https://plantuml.com/) render tools.

## Recommended Usage (for non-IT readers)

- Use short diagrams (without `-detailed`) for high-level presentation slides.
- Use `-detailed` diagrams for chapter content, appendix, and process explanation.
- Pair each detailed activity diagram with one short paragraph in plain language.
