export type ObservabilityEventCategory =
  | 'api'
  | 'business'
  | 'performance'
  | 'runtime'
  | 'screen_view'
  | 'user_action'
  | 'validation';

export interface ObservabilityEventDefinition<TName extends string = string> {
  category: ObservabilityEventCategory;
  description: string;
  name: TName;
}
