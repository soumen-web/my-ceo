export type HrQueryRecordDto = Record<string, unknown>;

export interface HrQueryEnvelopeDto<TData = unknown> {
  data?: TData;
  message?: string;
  meta?: unknown;
  success?: boolean;
}

export type HrQueryListDataDto =
  | HrQueryRecordDto[]
  | {
      employeeRequests?: HrQueryRecordDto[];
      items?: HrQueryRecordDto[];
      records?: HrQueryRecordDto[];
      requests?: HrQueryRecordDto[];
      rows?: HrQueryRecordDto[];
    };

export type HrQuerySnapshotDto = HrQueryEnvelopeDto<HrQueryListDataDto> | HrQueryRecordDto[];
export type HrQueryDto = HrQueryEnvelopeDto<HrQueryRecordDto> | HrQueryRecordDto;

export interface CreateHrQueryRequestDto {
  description: string;
  title: string;
}
