export type HrmsRecordDto = Record<string, unknown>;

export interface HrmsEnvelopeDto<TData = unknown> {
  data?: TData;
  message?: string;
  meta?: unknown;
  success?: boolean;
}

export type HrmsListEnvelopeDto = HrmsEnvelopeDto<
  | HrmsRecordDto[]
  | {
      items?: HrmsRecordDto[];
      page?: unknown;
    }
>;

export interface HrmsSelfServiceSnapshotDto {
  attendanceReadiness: HrmsEnvelopeDto;
  documents: HrmsListEnvelopeDto;
  employees: HrmsListEnvelopeDto;
  jobDesignations: HrmsListEnvelopeDto;
  organizationTeams: HrmsListEnvelopeDto;
  profile: HrmsEnvelopeDto;
  qualifications: HrmsListEnvelopeDto;
  requests: HrmsListEnvelopeDto;
}
