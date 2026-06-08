export class CompliancePolicyError extends Error {
  public readonly code: string;
  public readonly reason: string;

  public constructor(message: string, reason = 'COMPLIANCE_POLICY_BLOCKED') {
    super(message);
    this.code = reason;
    this.name = 'CompliancePolicyError';
    this.reason = reason;
  }
}
