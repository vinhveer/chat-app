import { SupabaseClient } from '@supabase/supabase-js';
import { BaseResponse, createSuccessResponse, createErrorResponse, createNotFoundResponse, ErrorType } from './status';

export interface DeleteOptions {
  table: string;
  filters: Record<string, any>;
  select?: string;
}

export async function deleteRecord<T = any>(
  supabase: SupabaseClient,
  options: DeleteOptions
): Promise<BaseResponse<T>> {
  try {
    let query = supabase
      .from(options.table)
      .delete();

    Object.entries(options.filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });

    let result;
    if (options.select) {
      const { data, error } = await query.select(options.select);
      if (error) {
        if (error.code === '23503') {
          return createErrorResponse<T>(ErrorType.CONSTRAINT_VIOLATION, 'Cannot delete: resource is referenced by other records');
        }
        return createErrorResponse<T>(ErrorType.QUERY_FAILED, error.message);
      }
      result = { data, error };
    } else {
      const { data, error } = await query;
      if (error) {
        if (error.code === '23503') {
          return createErrorResponse<T>(ErrorType.CONSTRAINT_VIOLATION, 'Cannot delete: resource is referenced by other records');
        }
        return createErrorResponse<T>(ErrorType.QUERY_FAILED, error.message);
      }
      result = { data, error };
    }

    if (!result.data || (Array.isArray(result.data) && result.data.length === 0)) {
      return createNotFoundResponse<T>(ErrorType.RESOURCE_NOT_FOUND, 'No resource found to delete');
    }

    const deletedItem = Array.isArray(result.data) ? result.data[0] : result.data;
    return createSuccessResponse(deletedItem as T, 'Resource deleted successfully');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    return createErrorResponse<T>(ErrorType.UNKNOWN_ERROR, message);
  }
}

export async function deleteById<T = any>(
  supabase: SupabaseClient,
  table: string,
  id: string,
  select?: string
): Promise<BaseResponse<T>> {
  return deleteRecord<T>(supabase, {
    table,
    filters: { id },
    select
  });
}
