import type { ObservabilityEventDefinition } from '@services/observability/events/types';

const defineEvent = <TName extends string>(
  name: TName,
  category: ObservabilityEventDefinition<TName>['category'],
  description: string,
): ObservabilityEventDefinition<TName> => ({
  category,
  description,
  name,
});

export const observabilityEvents = {
  apiRequestCompleted: defineEvent(
    'api_request_completed',
    'api',
    'An API request completed with duration metadata.',
  ),
  apiRequestFailed: defineEvent(
    'api_request_failed',
    'api',
    'An API request failed and was mapped into an app-safe error.',
  ),
  authLoginFailed: defineEvent(
    'auth_login_failed',
    'business',
    'Authentication failed for a submitted sign-in attempt.',
  ),
  authLoginSubmitted: defineEvent(
    'auth_login_submitted',
    'user_action',
    'A user submitted the sign-in form.',
  ),
  authLoginSucceeded: defineEvent(
    'auth_login_succeeded',
    'business',
    'Authentication succeeded and a session was established.',
  ),
  authSessionRestored: defineEvent(
    'auth_session_restored',
    'runtime',
    'A secure session was restored during bootstrap.',
  ),
  authSignedOut: defineEvent(
    'auth_signed_out',
    'user_action',
    'A session was terminated by user action or policy.',
  ),
  authUnauthorized: defineEvent(
    'auth_unauthorized',
    'runtime',
    'The current session became unauthorized and local state was cleared.',
  ),
  formValidationFailed: defineEvent(
    'form_validation_failed',
    'validation',
    'A client-side or mapped server-side validation failure was shown to the user.',
  ),
  performanceApiLatencyMeasured: defineEvent(
    'performance_api_latency_measured',
    'performance',
    'API latency was measured for an outbound request.',
  ),
  performanceBootstrapMeasured: defineEvent(
    'performance_bootstrap_measured',
    'performance',
    'Application bootstrap duration was measured.',
  ),
  performanceInteractionMeasured: defineEvent(
    'performance_interaction_measured',
    'performance',
    'An interaction timing was measured.',
  ),
  performanceScreenLoadMeasured: defineEvent(
    'performance_screen_load_measured',
    'performance',
    'A screen load timing was measured.',
  ),
  runtimeAppStateChanged: defineEvent(
    'runtime_app_state_changed',
    'runtime',
    'The application lifecycle state changed.',
  ),
  runtimeBootstrapCompleted: defineEvent(
    'runtime_bootstrap_completed',
    'runtime',
    'The controlled startup pipeline completed successfully.',
  ),
  runtimeBootstrapFailed: defineEvent(
    'runtime_bootstrap_failed',
    'runtime',
    'The controlled startup pipeline failed.',
  ),
  runtimeBootstrapStarted: defineEvent(
    'runtime_bootstrap_started',
    'runtime',
    'The controlled startup pipeline began execution.',
  ),
  screenHomeViewed: defineEvent(
    'screen_home_viewed',
    'screen_view',
    'The home screen became visible.',
  ),
  screenMyOrganizationInfoViewed: defineEvent(
    'screen_my_organization_info_viewed',
    'screen_view',
    'The organization info screen became visible.',
  ),
  screenMyReportingManagerViewed: defineEvent(
    'screen_my_reporting_manager_viewed',
    'screen_view',
    'The reporting manager screen became visible.',
  ),
  screenMyTeamViewed: defineEvent(
    'screen_my_team_viewed',
    'screen_view',
    'The my team screen became visible.',
  ),
  screenMyWorkLocationViewed: defineEvent(
    'screen_my_work_location_viewed',
    'screen_view',
    'The work location screen became visible.',
  ),
  screenMyWorkModeViewed: defineEvent(
    'screen_my_work_mode_viewed',
    'screen_view',
    'The work mode screen became visible.',
  ),
  screenMoreViewed: defineEvent(
    'screen_more_viewed',
    'screen_view',
    'The more screen became visible.',
  ),
  screenProfileViewed: defineEvent(
    'screen_profile_viewed',
    'screen_view',
    'The profile screen became visible.',
  ),
  screenSignInViewed: defineEvent(
    'screen_sign_in_viewed',
    'screen_view',
    'The sign-in screen became visible.',
  ),
  screenPrivacyPolicyViewed: defineEvent(
    'screen_privacy_policy_viewed',
    'screen_view',
    'The privacy policy screen became visible.',
  ),
  screenTermsConditionsViewed: defineEvent(
    'screen_terms_conditions_viewed',
    'screen_view',
    'The terms and conditions screen became visible.',
  ),
  screenUpgradeViewed: defineEvent(
    'screen_upgrade_viewed',
    'screen_view',
    'The upgrade screen became visible.',
  ),
} as const;

export type ObservabilityEventName =
  (typeof observabilityEvents)[keyof typeof observabilityEvents]['name'];
