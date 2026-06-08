# Base Structure

Use this file immediately after cloning or creating a new Expo/React Native project. It is the source of truth for recreating this project's reusable architecture.

## Developer Prompt

```txt
Please follow BaseStructure.md from the doc folder and create the complete initial project architecture using the same folder structure, reusable patterns, navigation flow, API structure, coding standards, and scalable architecture used in this project.
```

## Current Architecture Rules

| Area | Required Pattern |
| --- | --- |
| App entry | Root `App.tsx` imports `src/app/App`; root `index.ts` registers the app. |
| Routing | React Navigation, typed route constants, root auth/app switch. No Expo Router app-folder routing. |
| Modules | Feature-first clean architecture under `src/modules`. |
| State | Redux Toolkit slices and Redux Saga files live centrally in `src/store`. |
| API | Use `src/services/api/client/apiClient.ts`, `apiEndpoints.ts`, DTOs, mappers, repositories, and use cases. |
| UI | Use `src/design-system`, `src/components`, `src/shared/ui`, and feature `presentation` folders. |
| Assets | Keep assets under `src/assets`, exported through local `index.ts` maps when needed. |
| Config | Runtime env/config belongs under `src/config`; do not hardcode project API URLs in screens. |

## Root Structure

```text
.
├── App.tsx
├── index.ts
├── app.config.ts
├── app.json
├── babel.config.js
├── eslint.config.js
├── jest.config.js
├── jest.setup.ts
├── package.json
├── tsconfig.json
├── doc
├── src
└── tests
```

Do not keep the default Expo template root folders for app code:

- No root `app`
- No root `assets`
- No root `components`
- No root `constants`
- No root `hooks`

## Source Structure

```text
src
├── app
│   ├── bootstrap
│   ├── providers
│   └── startup
├── assets
│   ├── fonts
│   └── images
├── components
├── compliance
├── config
│   ├── build-config
│   ├── env
│   ├── feature-flags
│   └── runtime-config
├── design-system
│   ├── components
│   ├── icons
│   ├── patterns
│   ├── theme
│   └── tokens
├── hooks
├── modules
│   ├── auth
│   └── home
├── navigation
│   ├── deep-links
│   ├── flows
│   ├── guards
│   ├── root
│   └── route-types
├── security
├── services
│   ├── access-control
│   ├── api
│   ├── background
│   ├── observability
│   ├── policy
│   ├── runtime
│   ├── storage
│   └── ui
├── shared
│   ├── constants
│   ├── core
│   ├── types
│   ├── ui
│   └── utils
├── store
│   ├── sagas
│   └── slices
├── styles
├── types
└── utils
```

## Base Modules

Keep the starting app intentionally small:

```text
src/modules
├── auth
│   ├── application
│   ├── domain
│   ├── hooks
│   ├── infrastructure
│   └── presentation
│       ├── components
│       ├── hooks
│       ├── mappers
│       ├── screens
│       │   ├── SignInScreen.tsx
│       │   └── SplashScreen.tsx
│       └── view-models
└── home
    ├── application
    ├── domain
    ├── infrastructure
    └── presentation
        ├── hooks
        ├── mappers
        ├── screens
        │   └── HomeScreen.tsx
        └── view-models
```

Create a new `src/modules/<feature>` only when a real new business area is added. Do not create modules named after the app, brand, Figma file, or temporary page name.

Use module-level `src/modules/<feature>/hooks` only for public feature hooks that are reused outside presentation. Use `presentation/hooks` for screen-specific view models and dispatch/select-state wiring.

## Navigation Baseline

```text
NavigationContainer
└── RootNavigator
    ├── AuthFlowNavigator
    │   ├── SplashScreen
    │   └── SignInScreen
    └── AppFlowNavigator
        └── HomeScreen
```

Route constants and param lists belong in `src/navigation/route-types/index.ts`. Navigators import screens from module public APIs such as `@/modules/auth` or `@/modules/home`.

## Store Baseline

```text
src/store
├── hooks.ts
├── index.ts
├── rootReducer.ts
├── store.ts
├── sagas
│   ├── authSaga.ts
│   ├── homeSaga.ts
│   └── rootSaga.ts
└── slices
    ├── authSlice.ts
    ├── deviceSlice.ts
    ├── homeSlice.ts
    └── uiSlice.ts
```

Reducers and sagas stay in `src/store`. Modules may re-export actions, selectors, public types, and screens from `src/modules/<feature>/index.ts`.

## API Baseline

Keep the governed API layer:

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

Every feature API should follow:

```text
screen/hook
└── dispatch(actionRequested())
    └── src/store/sagas/<feature>Saga.ts
        └── use case
            └── repository
                └── infrastructure API wrapper
                    └── governed apiClient
```

For detailed API rules, use `doc/API_STRUCTURE.md` and `doc/ImplementApi.md`.

## Test Structure

```text
tests
├── components
├── modules
│   ├── auth
│   └── home
└── services
    ├── api
    ├── observability
    └── storage
```

Add `tests/modules/<feature>` when a new feature module is added.

## Coding Standards

- Use strict TypeScript and explicit DTO/entity/view-model types.
- Use `import type` for type-only imports.
- Keep domain files pure: no React, Redux, API client, storage, or navigation imports.
- Keep screens thin: compose UI, dispatch actions, read presentation hooks/selectors.
- Do not call raw API wrappers from screens or presentation hooks.
- Normalize backend responses in mappers before data reaches screens.
- Do not log passwords, tokens, OTPs, or raw sensitive payloads.
- Prefer project aliases such as `@/modules/auth`, `@services/...`, and `@design-system/...`.

## Adding New Work

| Task | Use |
| --- | --- |
| Build a new screen from Figma | `doc/FigmaStructure.md` |
| Implement a new backend endpoint | `doc/ImplementApi.md` |
| Add or change API architecture rules | `doc/API_STRUCTURE.md` |

When adding pages, follow destination-path priority:
1. Use the user-provided path when present.
2. If no path is provided, infer `auth` or `home` from the page name.
3. If neither applies, create `src/modules/<page-name>/presentation/screens`.

When adding APIs, follow feature-target priority:
1. Use the user-provided feature/path when present.
2. If no feature is provided, infer it from the cURL endpoint resource name.
3. Create new `<feature>Slice` and `<feature>Saga` only when that feature does not exist.
4. If feature already exists, add new API actions/handlers into the same existing slice and saga.

## Verification Checklist

After setup or restructuring, run:

```bash
npm run typecheck
npm run lint
```

Also verify:

1. Only app source under `src`.
2. Only required modules exist.
3. Navigation route constants match registered screens.
4. Reducers are registered in `rootReducer.ts`.
5. Sagas are registered in `rootSaga.ts`.
6. API requests use the governed `apiClient`.
7. `.env.example` contains project-safe placeholders or intended clone defaults.
