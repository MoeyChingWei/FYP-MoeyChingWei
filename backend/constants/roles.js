/**
 * Canonical backend roles.
 * Keep these values aligned with the `users.role` column in the database.
 */

const ROLES = Object.freeze({
  ADMIN: "Admin",
  MANAGER: "Manager",
  DEPARTMENT_EXECUTIVE: "Department Executive",
  ACCOUNT_PAYABLE: "Account Payable",
  TREASURY_FINANCE_OFFICER: "Treasury / Finance Officer",
  PAYMENT_TEAM: "Payment Team",
  EMPLOYEE: "Employee",
  SUPPLIER: "Supplier",
});

const ROLE_VALUES = Object.freeze(Object.values(ROLES));

function isValidRole(value) {
  return typeof value === "string" && ROLE_VALUES.includes(value);
}

export { ROLES, ROLE_VALUES, isValidRole };

