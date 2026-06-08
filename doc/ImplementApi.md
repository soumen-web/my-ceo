# Implement API

Use this file when cURL, Swagger/OpenAPI notes, Postman details, or backend response examples are provided. It keeps new API work aligned with the current service, state, loading, error, and response architecture.

## Developer Prompt

```txt
I need to implement this API.

Please follow ImplementApi.md from the doc folder and implement the API using the same service layer, hooks structure, response handling, error management, loading flow, and state management architecture used in this project.

API cURL:
[paste curl here]

Use this API in:
[screen/module name]
```

If `Use this API in` includes an explicit file path or folder path, update that exact location.
If no path is given, infer the target module from the screen or feature name, following the same module rules as `doc/FigmaStructure.md`.

## API Target Resolution Rules

Use these rules in order:

1. If user provides an explicit feature/module name or path in `Use this API in`, update that same feature.
2. If that target already has `src/store/slices/<feature>Slice.ts` and `src/store/sagas/<feature>Saga.ts`, add the new API request flow inside those existing files.
3. If no target is provided, infer `<feature>` from the cURL endpoint resource name:
   - Example: `/v1/auth/login` -> `auth`
   - Example: `/v1/profile/details` -> `profile`
   - Example: `/v1/legal-financial/assets` -> `legal-financial`
4. When inferred feature has no existing store files, create a separate `slice` and `saga` for that feature.
5. When inferred feature already exists, extend that feature with new actions, saga handler, DTO/repository/use-case additions for the new endpoint.

Naming rules for inferred features:

- Module folder: `src/modules/<feature>` in kebab-case.
- Slice file: `src/store/slices/<feature>Slice.ts`.
- Saga file: `src/store/sagas/<feature>Saga.ts`.
- Actions should be endpoint-intent based, for example `fetchProfileRequested`, `createMessageRequested`, `updatePolicyRequested`.

## Required API Flow

```text
screen or presentation hook
└── dispatch(loadFeatureRequested(payload))
    └── src/store/sagas/<feature>Saga.ts
        ├── call featureUseCases.loadFeature.execute(payload)
        ├── put(loadFeatureSucceeded(domainData))
        └── put(loadFeatureFailed(appError.userMessage))
            └── src/modules/<feature>/application/use-cases
                └── repository contract
                    └── infrastructure repository
                        └── infrastructure API wrapper
                            └── governed apiClient
```

Screens and hooks must not import or call infrastructure API wrappers directly.

## Files To Create Or Update

### Store

```text
src/store
├── slices
│   └── <feature>Slice.ts
├── sagas
│   └── <feature>Saga.ts
├── rootReducer.ts
└── sagas
    └── rootSaga.ts
```

### Module

```text
src/modules/<feature>
├── application
│   ├── runtime.ts
│   └── use-cases
├── domain
│   ├── entities
│   └── repositories
├── infrastructure
│   ├── api
│   │   └── <feature>Api.ts
│   ├── dtos
│   │   └── <Feature>Dto.ts
│   ├── mappers
│   │   └── <feature>Mapper.ts
│   └── repositories
│       └── <Feature>RepositoryImpl.ts
└── presentation
    ├── hooks
    ├── mappers
    └── view-models
```

Add `presentation/screens` only when the API work also introduces a new screen. For APIs used by existing screens, update the existing screen and its `presentation/hooks` view model.

### Shared API

```text
src/services/api/apiEndpoints.ts
src/services/api/client/apiClient.ts
src/services/api/error-mapping/mapApiError.ts
src/services/ui/globalLoader/globalLoaderService.ts
src/shared/ui/GlobalApiLoader.tsx
```

For lower-level API architecture details, use `doc/API_STRUCTURE.md`.

## Store Rules

- Async state lives in `src/store/slices/<feature>Slice.ts`.
- Saga side effects live in `src/store/sagas/<feature>Saga.ts`.
- Register every reducer in `src/store/rootReducer.ts`.
- Register every saga in `src/store/sagas/rootSaga.ts`.
- Re-export public actions, selectors, reducer, screens, and public types from `src/modules/<feature>/index.ts`.
- Do not create reducers or sagas inside `src/modules/<feature>`.
- Keep public feature hooks in `src/modules/<feature>/hooks` only when they are reused outside the presentation layer.
- For repeated APIs in the same feature, keep using the same `<feature>Slice.ts` and `<feature>Saga.ts`; add new request/success/failure action groups and saga handlers there.

## Saga Pattern

```ts
import type { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';

import { featureUseCases } from '@/modules/<feature>/application/runtime';
import { logger } from '@/services/observability/logger/logger';
import { toAppError } from '@/shared/core/errors/AppError';

import {
  loadFeatureFailed,
  loadFeatureRequested,
  loadFeatureSucceeded,
  type LoadFeatureRequestedPayload,
} from '../slices/<feature>Slice';

function* handleLoadFeature(action: PayloadAction<LoadFeatureRequestedPayload>) {
  try {
    const result: FeatureEntity = yield call(
      [featureUseCases.loadFeature, featureUseCases.loadFeature.execute],
      action.payload,
    );

    yield put(loadFeatureSucceeded(result));
  } catch (error) {
    const appError = toAppError(error);

    yield call([logger, logger.warn], 'Load feature failed', {
      code: appError.code,
      details: appError.details,
      scope: 'featureSaga',
    });
    yield put(loadFeatureFailed(appError.userMessage));
  }
}

export function* featureSaga() {
  yield takeLatest(loadFeatureRequested.type, handleLoadFeature);
}
```

## API Implementation Rules

| Rule | Requirement |
| --- | --- |
| Endpoint constants | Add paths to `src/services/api/apiEndpoints.ts`. |
| API wrapper | Use the governed `apiClient` only. |
| Global loader | Let `apiClient` trigger `GlobalApiLoader`; do not build separate global loaders per screen. |
| DTOs | Model raw backend request/response shape. |
| Mappers | Convert DTOs into safe domain entities and normalize nulls/inconsistent data. |
| Repositories | Return domain data, not DTOs. |
| Use cases | Expose app actions as class instances with `execute`. |
| Hooks | Dispatch store actions and select state; do not import API wrappers. |
| Errors | Convert with `mapApiError` or `toAppError` and show user-safe messages. |
| Security | Never log tokens, passwords, OTPs, or raw sensitive payloads. |

## Response Handling

- Keep backend DTOs in `infrastructure/dtos`.
- Keep domain entities in `domain/entities`.
- Normalize optional strings, arrays, IDs, booleans, and date values in mappers.
- Throw a mapped app error if required fields are missing.
- Keep screen view models separate from DTOs.

## Loading And Error UX

- Use `GlobalApiLoader` for request lifecycle via the governed API client.
- Use local `status` or `isPending` state for button disabling or inline states.
- Store `errorMessage` as a user-safe string.
- Clear stale errors when a new request starts.

## Verification Checklist

Run:

```bash
npm run typecheck
npm run lint
```

Confirm:

1. Endpoint is registered.
2. API wrapper uses `apiClient`.
3. DTO, mapper, repository, use case, slice, and saga exist where needed.
4. Reducer and saga are registered.
5. Module public exports are updated.
6. Screen/hook dispatches store actions instead of calling APIs directly.
7. Sensitive data is not logged.
