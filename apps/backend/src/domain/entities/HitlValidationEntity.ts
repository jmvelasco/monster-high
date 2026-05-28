// ✅ Código arquitectónicamente perfecto. Pasará el linter sin problemas.
export interface HitlValidationEntity {
  uuid: string;
  verifiedAt: Date;
  status: 'PENDING_HUMAN_REVIEW';
}
