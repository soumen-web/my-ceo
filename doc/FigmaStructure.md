# Figma Structure

Use this file when a Figma node, screen URL, screenshot, or design note is provided. It keeps new UI aligned with the current project architecture.

## Developer Prompt

```txt
I am providing a Figma node/screen.

Please follow FigmaStructure.md from the doc folder and create the screen using the same UI architecture, responsive styling system, reusable component structure, theme handling, and coding standards used in this project.

Figma Node:
[paste figma node here]

Optional Target Path:
[paste folder path here]
```

## Screen Placement

| Screen Type | Destination |
| --- | --- |
| Sign in, login, auth splash, auth onboarding, forgot/reset auth flows | `src/modules/auth/presentation/screens` |
| Home, dashboard, post-login landing | `src/modules/home/presentation/screens` |
| New business feature screen | `src/modules/<feature>/presentation/screens` |
| Feature-only repeated UI | `src/modules/<feature>/presentation/components` |
| Cross-feature app UI | `src/components` |
| Generic primitive/composite UI | `src/design-system/components` |
| Reusable screen states/layouts | `src/design-system/patterns` or `src/shared/ui` |

Do not create `src/modules/<figma-file-name>` or `src/modules/<app-name>` just because the design file has that name.

## Path Resolution Rules

Use these rules in order:

1. If the user provides a page path or folder path, create the screen in that exact folder.
2. If the user provides a file path, create the new screen beside that file in the same folder.
3. If no path is provided, infer the folder from the page name:
   - Auth-like names such as `SignIn`, `Login`, `Splash`, `OTP`, `ForgotPassword`: `src/modules/auth/presentation/screens`
   - Home-like names such as `Home`, `Dashboard`: `src/modules/home/presentation/screens`
4. If no known module can be inferred, create a new feature folder using the page name in kebab-case:
   - `src/modules/<page-name>/presentation/screens`

When multiple pages belong to the same feature, keep them in the same `presentation/screens` folder.
Example: `SignInScreen` and `SplashScreen` should both stay in `src/modules/auth/presentation/screens`.

## Feature Screen Structure

```text
src/modules/<feature>
└── presentation
    ├── components
    │   └── <FeatureCard>.tsx
    ├── hooks
    │   └── use<Feature>ScreenModel.ts
    ├── mappers
    │   └── to<Feature>ViewModel.ts
    ├── screens
    │   └── <Feature>Screen.tsx
    └── view-models
        └── <Feature>ViewModel.ts
```

Add `presentation/hooks` only when the screen has derived state, dispatch logic, selectors, or repeated behavior. Keep simple static screens in `presentation/screens`.
Add `presentation/mappers` and `presentation/view-models` when API/domain data needs to be converted for the screen.

## Implementation Flow

1. Inspect the Figma node/screenshot and identify the correct module.
2. Resolve destination folder using the Path Resolution Rules.
3. Reuse existing design-system primitives, shared components, theme tokens, scale helpers, and assets.
4. Create feature-only components under the feature's `presentation/components` folder.
5. Keep the screen file responsible for layout composition, safe area, route params, and navigation.
6. Use `StyleSheet.create`, theme tokens, `spacing`, `radius`, and `fontSize` helpers.
7. Add assets under `src/assets/images/<feature>` only when the screen truly needs new image assets.
8. Register new routes in `src/navigation/route-types/index.ts` and the matching flow navigator.
9. Export the screen from `src/modules/<feature>/index.ts`.
10. Run verification.

For a new screen in a brand-new feature, create the full feature module boundary first:

```text
src/modules/<feature>
├── application
├── domain
├── infrastructure
└── presentation
```

## Responsive Styling Rules

- Use safe-area aware containers for full screens.
- Use scroll containers for forms and long content.
- Avoid fixed heights for text-heavy sections.
- Keep buttons and inputs large enough for touch.
- Use max-width wrappers for tablet/web layouts when needed.
- Make text fit without overlap on small and large devices.
- Keep screen-specific styles inside the screen unless they are reused.
- Use `ResponsiveDecorativeOrb` from `src/design-system/patterns` for decorative glows/halos instead of hardcoded absolute offsets.
- Decorative assets should be non-interactive and positioned from responsive ratios, not negative fixed `top/right/bottom/left` values inside screens.

## Generic Loader And Animation Feature Rules

Use these rules for every new feature screen, Figma implementation, loading state, empty state, list, card group, modal, and bottom sheet.

### Developer Prompt

```txt
Please implement this feature with the project's generic premium loader and animation system.

Follow doc/FigmaStructure.md and reuse existing motion/loading primitives:
- PremiumAnimatedView
- PremiumPressable
- PremiumSkeleton
- EnterpriseFeedbackBanner
- EmptyState
- LoadingState
- GlobalApiLoader
- premiumStackScreenOptions

Requirements:
- Screen content must enter with subtle fade, slide up, and soft scale.
- Cards and list items must fade/slide in with small staggered delays.
- Buttons and tappable cards must use premium press scale feedback plus native ripple where supported.
- Known loading layouts must use skeleton placeholders instead of blank screens or generic spinners.
- Unknown/global API loading must use the shared GlobalApiLoader only.
- Empty/error/loading feedback must use shared branded feedback components.
- Modals and bottom sheets must slide up smoothly and respect keyboard/safe-area behavior.
- Expand/collapse groups must animate height/layout and opacity without layout jumps.
- All motion must respect reduced-motion accessibility.
- Do not create duplicate feature-specific loader, animation, skeleton, or spinner systems.
```

### Required Shared Primitives

| Need | Required Primitive |
| --- | --- |
| Screen/card/list enter animation | `PremiumAnimatedView` |
| Button or tappable card feedback | `PremiumPressable` |
| Structured loading placeholder | `PremiumSkeleton` |
| API-level blocking loader | `GlobalApiLoader` |
| Empty/error/info/loading banner | `EnterpriseFeedbackBanner` |
| Full reusable empty page state | `EmptyState` |
| Full reusable loading page state | `LoadingState` |
| Native stack transition defaults | `premiumStackScreenOptions` |
| Keyboard-aware bottom sheet movement | `KeyboardAwareBottomSheetView` |

### Feature Implementation Rules

- Add loading, error, empty, and ready states to every data-driven feature screen.
- Show skeletons when final content structure is known.
- Use `GlobalApiLoader` only for API-wide blocking requests triggered by the governed API client.
- Never add a new full-screen spinner inside a feature when a skeleton or shared loading state can represent the layout.
- Keep motion wrappers close to rendered UI, not inside DTOs, mappers, repositories, sagas, or API code.
- Use `PremiumAnimatedView` for feature hero cards, stat cards, section cards, empty states, feedback cards, and short static lists.
- For long or virtualized lists, animate only visible row components with short stagger delays; do not animate the whole list height.
- Use `PremiumPressable` for custom pressable cards/buttons. Keep `android_ripple` where applicable.
- Do not animate sensitive data reveal. Secure fields can use static cards or animate only the surrounding non-sensitive section.
- Do not run decorative infinite loops except required loader/skeleton shimmer.
- Keep animation distance small and timing fast enough to feel native.
- Respect reduced-motion mode through the shared primitives instead of adding per-screen accessibility logic.

### Motion Timing Standards

| Motion | Standard |
| --- | --- |
| Screen enter | 250ms-350ms target; project shared timing may be slightly softer for premium feel |
| Card/list item enter | Fade + 4px-8px translateY + optional soft scale |
| Stagger delay | 40ms-70ms between visible items |
| Press feedback | Scale around `0.97`-`0.98`, 100ms-150ms |
| Expand/collapse | 220ms-280ms layout/opacity transition |
| Bottom sheet/modal | 250ms-300ms slide/fade |
| Skeleton shimmer | Subtle, slow, non-flashy |

### Quality Gate

Before finishing a feature UI:

- Check no blank screen appears during initial data loading.
- Check skeleton shapes roughly match the final layout.
- Check empty states have a useful title/message and optional action.
- Check buttons respond immediately on press.
- Check cards/lists do not flicker on render.
- Check expand/collapse preserves layout and scroll position.
- Check bottom sheets stay visible with keyboard open.
- Check reduced motion keeps the feature usable without animation.
- Run `npm run typecheck`, `npm run lint`, and `git diff --check` when code changes are made.

## Theme And Asset Rules

- Prefer semantic theme tokens and project color constants over repeated hardcoded colors.
- For MyCEO app glass surfaces, use `reactNativeColorScheme.ultiHuman.surface` tokens. Do not inline repeated values such as `rgba(255, 255, 255, 0.68)` or `rgba(209, 244, 252, 0.7)` in screens, modules, or components.
- Use font constants or typography tokens.
- Add repeated visual values to tokens when they become part of the design language.
- Register image groups through an `index.ts` map when more than one asset is used.
- Keep feature-specific assets out of shared folders unless they are truly reused.

## Navigation Rules

- Routes are constants, not inline strings.
- Param types live in `src/navigation/route-types/index.ts`.
- Navigators import screens from module public exports.
- Do not pass secrets or large objects through route params.

## Keyboard And Modal Behavior Rules

Use these rules when a Figma screen includes a form, OTP input, search field, comments field, bottom sheet, modal, or any input near the bottom of the screen.

### Core Goal

- Keyboard-open state must keep focused inputs and action buttons visible on Android and iOS.
- Keep keyboard handling in the closest shared screen/modal wrapper, not inside every input component.
- Do not stack multiple keyboard strategies on the same axis.

### Platform Rules

- iOS: prefer `KeyboardAvoidingView` with `behavior="padding"`.
- Android: prefer measured keyboard height or native `adjustResize`; do not rely on `KeyboardAvoidingView` alone for bottom sheets.
- Android native activity must use `android:windowSoftInputMode="adjustResize"`.
- Use `keyboardWillShow` / `keyboardWillHide` on iOS.
- Use `keyboardDidShow` / `keyboardDidHide` on Android.

### Reusable Keyboard Inset Pattern

Use the shared project hook instead of creating per-screen keyboard listeners:

```tsx
import { useKeyboardBottomInset } from '@/design-system/hooks';

const { bottomInset, keyboardHeight, keyboardVisible } = useKeyboardBottomInset({
  enabled: true,
  extraOffset: 8,
});
```

The implementation lives in `src/design-system/hooks/useKeyboardBottomInset.ts`.

```tsx
import { useEffect, useMemo, useState } from 'react';
import { Keyboard, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface UseKeyboardBottomInsetOptions {
  enabled?: boolean;
  extraOffset?: number;
}

export const useKeyboardBottomInset = ({
  enabled = true,
  extraOffset = 0,
}: UseKeyboardBottomInsetOptions = {}) => {
  const insets = useSafeAreaInsets();
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setKeyboardHeight(0);
      setKeyboardVisible(false);
      return undefined;
    }

    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (event) => {
      setKeyboardVisible(true);
      setKeyboardHeight(event.endCoordinates.height);
    });

    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardVisible(false);
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [enabled]);

  return useMemo(() => {
    const bottomInset = Math.max(0, keyboardHeight - insets.bottom + extraOffset);

    return {
      bottomInset,
      insets,
      keyboardHeight,
      keyboardVisible,
    };
  }, [extraOffset, insets, keyboardHeight, keyboardVisible]);
};
```

### Keyboard-Aware Screen Shell

For long mobile forms that use `MobileScreenShell`, enable keyboard handling at the shell level:

```tsx
<MobileScreenShell header={header} keyboardAware>
  {children}
</MobileScreenShell>
```

Current shared behavior:

- iOS wraps content with `KeyboardAvoidingView` using `behavior="padding"`.
- Android adds measured keyboard bottom padding to the scroll content.
- Android keyboard-aware screens call `scrollToEnd` shortly after the keyboard opens so bottom fields like `Reason` stay visible.
- Keep this behavior in the shared shell or feature frame, not inside individual `TextInput` components.

Feature frames can expose this as an opt-in prop:

```tsx
<LeaveScreenFrame isDetail keyboardAware navigation={navigation} title="Apply leave">
  {/* form content */}
</LeaveScreenFrame>
```

### Bottom Sheet Pattern

For bottom modal/sheet UI:

- Prefer `KeyboardAwareBottomSheetView` from `src/design-system/patterns/KeyboardAwareBottomSheetView.tsx` for new shared sheets.
- Wrap the sheet in a full-screen overlay aligned to the bottom.
- Keep `KeyboardAvoidingView` for iOS only.
- On Android, move the sheet with measured `marginBottom`.
- Remove normal Android bottom safe-area spacing while keyboard is open by using `keyboardHeight - insets.bottom`.
- Keep close buttons and fixed footers inside the moving sheet container.

```tsx
const androidBottomSpace =
  Platform.OS === 'android'
    ? keyboardVisible
      ? bottomInset
      : insets.bottom
    : 0;

<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : undefined}
  keyboardVerticalOffset={0}
  style={styles.overlay}
>
  <View style={[styles.sheet, { marginBottom: androidBottomSpace }]}>
    {children}
  </View>
</KeyboardAvoidingView>
```

### Scrollable Form Content

Use this for form content inside sheets or long screens:

```tsx
<ScrollView
  keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
  keyboardShouldPersistTaps="handled"
  showsVerticalScrollIndicator={false}
  contentContainerStyle={{
    paddingBottom: basePadding + androidKeyboardInset,
  }}
>
  {children}
</ScrollView>
```

For Android forms with a bottom text area or submit preview, add measured padding and delayed `scrollToEnd` in the shared shell after `keyboardDidShow`.

### Common Keyboard Problems

| Problem | Usual cause | Fix |
| --- | --- | --- |
| Android sheet stays behind keyboard | `KeyboardAvoidingView` does not move a transparent modal reliably | Use measured keyboard height as `marginBottom` |
| iOS sheet jumps too high | Manual keyboard height stacked on top of `KeyboardAvoidingView` | Let iOS use `KeyboardAvoidingView` only |
| Android sheet floats with a gap | Safe-area bottom inset added while keyboard is open | Use `keyboardHeight - insets.bottom` |
| Submit button is hidden | Footer outside keyboard-aware container | Move footer inside the moving sheet or apply same inset |
| Android bottom input stays under keyboard | Scroll content has padding but does not move to focused area | Add measured bottom padding and delayed `scrollToEnd` in shared shell |
| First tap only dismisses keyboard | Scroll view swallows taps | Add `keyboardShouldPersistTaps="handled"` |
| Layout bounces when focusing fields | Screen-level and modal-level keyboard handlers both active | Keep behavior in the closest shared wrapper |

### Keyboard QA Checklist

Test on Android and iOS:

1. Focus the first input.
2. Focus the last input near the bottom.
3. Tap submit/action while keyboard is open.
4. Drag-scroll while keyboard is open.
5. Close the keyboard and confirm UI returns to the bottom.
6. Test Android gesture navigation and three-button navigation when safe-area spacing matters.

## Verification Checklist

Run:

```bash
npm run typecheck
npm run lint
```

Confirm:

1. The screen is in the correct `presentation/screens` folder.
2. Repeated UI was extracted only when useful.
3. Styling uses the current token/responsive system.
4. Assets are under `src/assets`.
5. Navigation is typed and registered.
6. No unrelated modules or duplicate architecture files were created.
