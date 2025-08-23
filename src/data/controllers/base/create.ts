import { SupabaseClient } from '@supabase/supabase-js';
import { BaseResponse, createSuccessResponse, createErrorResponse, ErrorType } from './status';

export interface CreateOptions<T = any> {
  table: string;
  data: T;
  select?: string;
}

export async function create<T = any>(
  supabase: SupabaseClient,
  options: CreateOptions<T>
): Promise<BaseResponse<T>> {
  try {
    const query = supabase
      .from(options.table)
      .insert(options.data);

    if (options.select) {
      query.select(options.select);
    }

    const { data, error } = await query;

    if (error) {
      if (error.code === '23505') {
        return createErrorResponse<T>(ErrorType.DUPLICATE_ENTRY, 'Resource already exists');
      }
      if (error.code === '23503') {
        return createErrorResponse<T>(ErrorType.CONSTRAINT_VIOLATION, 'Foreign key constraint violation');
      }
      return createErrorResponse<T>(ErrorType.QUERY_FAILED, error.message);
    }

    return createSuccessResponse(data as T, 'Resource created successfully');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    return createErrorResponse<T>(ErrorType.UNKNOWN_ERROR, message);
  }
}
