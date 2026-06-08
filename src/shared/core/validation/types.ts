export interface ServerFieldError {
  field: string;
  message: string;
}

export interface ServerValidationErrorPayload {
  fieldErrors?: ServerFieldError[];
}
