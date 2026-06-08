# API Structure

The API architecture should ensure every request uses the same base URL, headers, auth handling, loading behavior, error mapping, telemetry, and response normalization.

## API Folders

```text
src/services/api
├── apiEndpoints.ts
├── apiError.ts
├── client
│   └── apiClient.ts
├── error-mapping
├── interceptors
└── serializers
```

Global API loading is part of the API foundation:

```text
src/services/ui/globalLoader/globalLoaderService.ts
src/shared/ui/GlobalApiLoader.tsx
```

Feature API wrapper files live in:

```text
src/modules/<feature>/infrastructure/api/<feature>Api.ts
```

## Feature Target Resolution

Use these rules in order:

1. If user provides a feature/module target, update that same feature.
2. If user does not provide a target, infer `<feature>` from the cURL endpoint resource name.
3. Create new `src/store/slices/<feature>Slice.ts` and `src/store/sagas/<feature>Saga.ts` only when the inferred feature does not already exist.
4. If the inferred feature already exists, append the endpoint flow to the same slice/saga instead of creating duplicate files.

Important: this infrastructure API file is only the low-level HTTP adapter. It must not be called from screens or presentation hooks. UI-triggered API execution must go through a Redux Saga generator in `src/store/sagas/<feature>Saga.ts`.

## Endpoint Registry

```ts
export const API = {
  feature: {
    resource: 'v1/<resource>',
    resourceById: (id: string) => `v1/<resource>/${id}`,
  },
} as const;
```

## Feature API Wrapper

```ts
import { API } from '@/services/api/apiEndpoints';
import { apiClient } from '@/services/api/client/apiClient';
import { mapApiError } from '@/services/api/error-mapping/mapApiError';

import type { FeatureResponseDto } from '../dtos/FeatureDto';

export const featureApi = {
  async fetchFeature(): Promise<FeatureResponseDto> {
    try {
      const response = await apiClient.get<FeatureResponseDto>(API.feature.resource);
      return response.data;
    } catch (error) {
      throw mapApiError(error);
    }
  },
};
```

## API Rules

| Rule | Reason |
| --- | --- |
| Use one governed API client | Preserves interceptors and runtime behavior. |
| Show global API loader by default | The API client must call `globalLoaderService.beginRequest()` before requests and `globalLoaderService.endRequest()` after responses/errors. |
| Store endpoints in `apiEndpoints.ts` | Keeps backend routes discoverable. |
| Use DTOs for raw responses | Protects domain from backend shape changes. |
| Use mappers for normalization | Keeps screens clean and safe. |
| Throw app errors | Ensures consistent error display and logs. |
| Do not call APIs from screens | Preserves clean architecture. |
| Do not call infrastructure API wrappers from hooks | Hooks should select store state and dispatch store actions. |
| Trigger UI API work from sagas | `src/store/sagas/<feature>Saga.ts` uses `function*`, `yield call`, `yield put`, and `yield takeLatest` to call use cases, which call repositories, which call infrastructure API wrappers. |

## Required API Execution Flow

```text
screen
└── dispatch(loadFeatureRequested())
    └── src/store/sagas/<feature>Saga.ts
        └── yield call([featureUseCases.loadFeature, featureUseCases.loadFeature.execute])
            └── FeatureRepositoryImpl
                └── featureApi.fetchFeature()
                    └── apiClient
```

`src/modules/<feature>/infrastructure/api/<feature>Api.ts` is still required, but it is not the orchestration layer. The orchestration layer for screen-driven API work is the Redux Saga generator in `src/store/sagas`.

## Global API Loader Flow

The project must include a global loader that appears automatically during API calls.

```text
apiClient request interceptor
└── globalLoaderService.beginRequest()
    └── GlobalApiLoader subscribes with useSyncExternalStore
        └── overlay spinner becomes visible

apiClient response/error interceptor
└── globalLoaderService.endRequest()
    └── overlay hides when pending request count returns to zero
```

`GlobalApiLoader` must be mounted once in the app provider/app shell, above the navigation content, so any API request can show the overlay. Endpoints may opt out only when there is a documented reason, using request metadata such as `skipGlobalLoader`.

## API Implementation Checklist

1. Add endpoint constant.
2. Add request/response DTOs.
3. Add API wrapper.
4. Add mapper.
5. Add repository contract and implementation.
6. Add use case.
7. Add or update `src/store/slices/<feature>Slice.ts`.
8. Add or update `src/store/sagas/<feature>Saga.ts`.
9. Register the reducer in `src/store/rootReducer.ts`.
10. Register the saga in `src/store/sagas/rootSaga.ts`.
11. Re-export public actions/selectors/types from `src/modules/<feature>/index.ts`.
12. Ensure the request uses the governed API client so the global loader appears.
13. Add tests for success and failure.
