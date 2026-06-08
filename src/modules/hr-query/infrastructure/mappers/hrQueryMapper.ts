import type {
  CreateHrQueryRequest,
  HrQuery,
  HrQueryCategory,
  HrQueryPriority,
  HrQuerySnapshot,
  HrQueryStatus,
} from '../../domain/entities/HrQuery';
import {
  createEmptyHrQuerySnapshot,
  HR_QUERY_CATEGORIES,
  HR_QUERY_PRIORITIES,
  HR_QUERY_STATUSES,
} from '../../domain/entities/HrQuery';
import type {
  CreateHrQueryRequestDto,
  HrQueryDto,
  HrQueryRecordDto,
  HrQuerySnapshotDto,
} from '../dtos/HrQueryDto';

const asRecord = (value: unknown): HrQueryRecordDto =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? (value as HrQueryRecordDto)
    : {};

const asString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' && value.trim() ? value.trim() : fallback;

const normalizeDate = (value: unknown): string => {
  const rawValue = asString(value, '');
  const date = rawValue ? new Date(rawValue) : new Date();

  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
};

const normalizeCategory = (value: unknown): HrQueryCategory => {
  const rawValue = asString(value, '').toLowerCase();
  const match = HR_QUERY_CATEGORIES.find((category) => category.toLowerCase() === rawValue);

  return match ?? 'General HR Support';
};

const normalizePriority = (value: unknown): HrQueryPriority => {
  const rawValue = asString(value, '').toLowerCase();
  const match = HR_QUERY_PRIORITIES.find((priority) => priority.toLowerCase() === rawValue);

  return match ?? 'Medium';
};

const normalizeStatus = (value: unknown): HrQueryStatus => {
  const rawValue = asString(value, 'Open')
    .toLowerCase()
    .replace(/[_-]+/g, ' ');
  const match = HR_QUERY_STATUSES.find((status) => status.toLowerCase() === rawValue);

  if (rawValue === 'pending' || rawValue === 'pending approval' || rawValue === 'submitted') {
    return 'Pending';
  }

  if (rawValue === 'approved' || rawValue === 'accepted') {
    return 'Approved';
  }

  if (rawValue === 'resolved' || rawValue === 'completed') {
    return 'Resolved';
  }

  return match ?? 'Open';
};

const unwrapData = (value: HrQueryDto | HrQuerySnapshotDto): unknown =>
  Array.isArray(value) ? value : asRecord(value).data ?? value;

const listData = (value: HrQuerySnapshotDto): HrQueryRecordDto[] => {
  const data = unwrapData(value);

  if (Array.isArray(data)) {
    return data.map(asRecord);
  }

  const record = asRecord(data);
  const collection =
    record.items ??
    record.records ??
    record.requests ??
    record.employeeRequests ??
    record.employee_requests ??
    record.results ??
    record.list ??
    record.rows ??
    record.data;

  return Array.isArray(collection) ? collection.map(asRecord) : [];
};

const mapRecordToQuery = (record: HrQueryRecordDto): HrQuery => {
  const id = asString(
    record.id ??
      record.requestId ??
      record.request_id ??
      record.employeeRequestId ??
      record.employee_request_id ??
      record.employeeRequestUuid ??
      record.requestTicketNumber,
    `hrq-${Date.now()}`,
  );
  const subject = asString(record.title ?? record.subject ?? record.requestTitle, 'HR query');
  const description = asString(
    record.description ?? record.message ?? record.requestDescription,
    'No description provided.',
  );
  const createdAt = normalizeDate(record.createdAt ?? record.created_at ?? record.createdOn);
  const updatedAt = normalizeDate(
    record.updatedAt ?? record.updated_at ?? record.modifiedAt ?? record.modified_at ?? createdAt,
  );
  const latestResponse = asString(
    record.actionRemarks ?? record.action_remarks ?? record.latestResponse ?? record.response,
    '',
  );

  return {
    category: normalizeCategory(record.category),
    createdAt,
    description,
    id,
    latestResponse: latestResponse || undefined,
    priority: normalizePriority(record.priority),
    resolutionNote: asString(record.resolutionNote ?? record.resolution, '') || undefined,
    status: normalizeStatus(record.status ?? record.requestStatus),
    subject,
    timeline: [
      {
        actor: 'You',
        createdAt,
        id: `${id}-created`,
        label: 'Query submitted',
        message: description,
      },
      ...(latestResponse
        ? [
            {
              actor: 'HR Support',
              createdAt: updatedAt,
              id: `${id}-response`,
              label: 'HR responded',
              message: latestResponse,
            },
          ]
        : []),
    ],
    updatedAt,
  };
};

export const hrQueryMapper = {
  createRequestToDto(request: CreateHrQueryRequest): CreateHrQueryRequestDto {
    return {
      description: request.description.trim(),
      title: request.subject.trim(),
    };
  },
  queryToDomain(envelope: HrQueryDto): HrQuery | null {
    const data = unwrapData(envelope);
    const recordData = asRecord(data);
    const record = asRecord(
      recordData.request ?? recordData.employeeRequest ?? recordData.employee_request ?? recordData,
    );

    return Object.keys(record).length ? mapRecordToQuery(record) : null;
  },
  snapshotToDomain(envelope: HrQuerySnapshotDto): HrQuerySnapshot {
    const queries = listData(envelope).map(mapRecordToQuery);

    return queries.length ? { queries } : createEmptyHrQuerySnapshot();
  },
};
