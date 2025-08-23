export enum OperationStatus {
  SUCCESS = 'success',
  ERROR = 'error',
  UNAUTHORIZED = 'unauthorized',
  NOT_FOUND = 'not_found',
  VALIDATION_ERROR = 'validation_error',
  CONFLICT = 'conflict',
  PERMISSION_DENIED = 'permission_denied'
}

export enum ErrorType {
  // Authentication errors
  USER_NOT_AUTHENTICATED = 'user_not_authenticated',
  INVALID_CREDENTIALS = 'invalid_credentials',
  SESSION_EXPIRED = 'session_expired',
  
  // Database errors
  DATABASE_CONNECTION_ERROR = 'database_connection_error',
  QUERY_FAILED = 'query_failed',
  CONSTRAINT_VIOLATION = 'constraint_violation',
  DUPLICATE_ENTRY = 'duplicate_entry',
  
  // Resource errors
  RESOURCE_NOT_FOUND = 'resource_not_found',
  RESOURCE_ALREADY_EXISTS = 'resource_already_exists',
  
  // Permission errors
  ACCESS_DENIED = 'access_denied',
  INSUFFICIENT_PERMISSIONS = 'insufficient_permissions',
  
  // Validation errors
  INVALID_INPUT = 'invalid_input',
  MISSING_REQUIRED_FIELD = 'missing_required_field',
  INVALID_FORMAT = 'invalid_format',
  
  // Room specific errors
  ROOM_CREATION_FAILED = 'room_creation_failed',
  MEMBER_ADD_FAILED = 'member_add_failed',
  ROOM_NOT_FOUND = 'room_not_found',
  ALREADY_ROOM_MEMBER = 'already_room_member',
  
  // Member specific errors
  MEMBER_NOT_FOUND = 'member_not_found',
  MEMBER_SEARCH_FAILED = 'member_search_failed',
  
  // Message specific errors
  MESSAGE_NOT_FOUND = 'message_not_found',
  MESSAGE_SEND_FAILED = 'message_send_failed',
  MESSAGE_EDIT_FAILED = 'message_edit_failed',
  MESSAGE_DELETE_FAILED = 'message_delete_failed',
  MESSAGE_EMPTY = 'message_empty',
  
  // Generic errors
  UNKNOWN_ERROR = 'unknown_error',
  OPERATION_FAILED = 'operation_failed'
}

export interface BaseResponse<T = any> {
  status: OperationStatus;
  data: T | null;
  errorType?: ErrorType;
  message?: string;
}

export const createSuccessResponse = <T>(data: T, message?: string): BaseResponse<T> => ({
  status: OperationStatus.SUCCESS,
  data,
  message
});

export const createErrorResponse = <T = null>(
  errorType: ErrorType,
  message?: string,
  status: OperationStatus = OperationStatus.ERROR
): BaseResponse<T> => ({
  status,
  data: null,
  errorType,
  message
});

export const createUnauthorizedResponse = <T = null>(
  errorType: ErrorType = ErrorType.USER_NOT_AUTHENTICATED,
  message: string = 'User not authenticated'
): BaseResponse<T> => ({
  status: OperationStatus.UNAUTHORIZED,
  data: null,
  errorType,
  message
});

export const createNotFoundResponse = <T = null>(
  errorType: ErrorType = ErrorType.RESOURCE_NOT_FOUND,
  message: string = 'Resource not found'
): BaseResponse<T> => ({
  status: OperationStatus.NOT_FOUND,
  data: null,
  errorType,
  message
});
