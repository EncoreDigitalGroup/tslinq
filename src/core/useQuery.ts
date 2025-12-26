/*
 * Copyright (c) 2025. Encore Digital Group.
 * All Rights Reserved.
 */

import {Query} from "./Query";

/**
 * React hook that wraps an array in a TSLinq Query instance
 * Provides LINQ-style querying with method chaining for any collection
 *
 * @param items - Array of items to query
 * @returns Memoized Query instance with fluent LINQ operations
 *
 * @example
 * ```typescript
 * const records: DetailedRecord[] = [...];
 * const query = useQuery(records);
 *
 * const featured = query.where(r => r.isFeatured).take(5).all();
 * const firstPublic = query.where(r => r.isPublic).first();
 * const sorted = query.orderBy(r => r.title).all();
 * ```
 */
export function useQuery<T>(items: T[]): Query<T> {
    return new Query(items);
}
