import { SupabaseClient } from '@supabase/supabase-js';
import { BaseResponse, createSuccessResponse, createErrorResponse, createNotFoundResponse, ErrorType } from './status';

export interface UpdateOptions<T = any> {
  table: string;
  data: Partial<T>;
  filters: Record<string, any>;
  select?: string;
}

export async function update<T = any>(
  supabase: SupabaseClient,
  options: UpdateOptions<T>
): Promise<BaseResponse<T>> {
  try {
    let query = supabase
      .from(options.table)
      .update(options.data);

    Object.entries(options.filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });

    let result;
    if (options.select) {
      const { data, error } = await query.select(options.select);
      if (error) {
        if (error.code === '23505') {
          return createErrorResponse<T>(ErrorType.DUPLICATE_ENTRY, 'Resource already exists');
        }
        if (error.code === '23503') {
          return createErrorResponse<T>(ErrorType.CONSTRAINT_VIOLATION, 'Foreign key constraint violation');
        }
        return createErrorResponse<T>(ErrorType.QUERY_FAILED, error.message);
      }
      result = { data, error };
    } else {
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
      result = { data, error };
    }

    if (!result.data || (Array.isArray(result.data) && result.data.length === 0)) {
      return createNotFoundResponse<T>(ErrorType.RESOURCE_NOT_FOUND, 'No resource found to update');
    }

    const updatedItem = Array.isArray(result.data) ? result.data[0] : result.data;
    return createSuccessResponse(updatedItem as T, 'Resource updated successfully');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    return createErrorResponse<T>(ErrorType.UNKNOWN_ERROR, message);
  }
}

export async function updateById<T = any>(
  supabase: SupabaseClient,
  table: string,
  id: string,
  data: Partial<T>,
  select?: string
): Promise<BaseResponse<T>> {
  return update<T>(supabase, {
    table,
    data,
    filters: { id },
    select
  });
}
