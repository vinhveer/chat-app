import { SupabaseClient } from '@supabase/supabase-js';
import { BaseResponse, createSuccessResponse, createErrorResponse, createNotFoundResponse, ErrorType } from './status';

export interface ReadOptions {
  table: string;
  select?: string;
  filters?: Record<string, any>;
  inFilters?: Record<string, any[]>; // For IN queries
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
  offset?: number;
  isNull?: string[]; // For IS NULL checks
  isNotNull?: string[]; // For IS NOT NULL checks
}

export interface ReadResult<T = any> extends BaseResponse<T[]> {
  count?: number;
}

export async function read<T = any>(
  supabase: SupabaseClient,
  options: ReadOptions
): Promise<ReadResult<T>> {
  try {
    let query = supabase
      .from(options.table)
      .select(options.select || '*', { count: 'exact' });

    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    if (options.inFilters) {
      Object.entries(options.inFilters).forEach(([key, values]) => {
        query = query.in(key, values);
      });
    }

    if (options.isNull) {
      options.isNull.forEach(column => {
        query = query.is(column, null);
      });
    }

    if (options.isNotNull) {
      options.isNotNull.forEach(column => {
        query = query.not(column, 'is', null);
      });
    }

    if (options.orderBy) {
      query = query.order(options.orderBy.column, {
        ascending: options.orderBy.ascending ?? true
      });
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error, count } = await query;

    if (error) {
      return {
        ...createErrorResponse<T[]>(ErrorType.QUERY_FAILED, error.message),
        count: 0
      };
    }

    return {
      ...createSuccessResponse(data as T[], 'Data retrieved successfully'),
      count: count || 0
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      ...createErrorResponse<T[]>(ErrorType.UNKNOWN_ERROR, message),
      count: 0
    };
  }
}

export async function readOne<T = any>(
  supabase: SupabaseClient,
  options: Omit<ReadOptions, 'limit' | 'offset'>
): Promise<BaseResponse<T>> {
  const result = await read<T>(supabase, { ...options, limit: 1 });
  
  if (result.status !== 'success') {
    return createErrorResponse<T>(result.errorType || ErrorType.QUERY_FAILED, result.message);
  }

  const item = result.data?.[0] || null;
  
  if (!item) {
    return createNotFoundResponse<T>(ErrorType.RESOURCE_NOT_FOUND, 'Resource not found');
  }

  return createSuccessResponse(item, 'Resource retrieved successfully');
}
