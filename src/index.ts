/*
 * Copyright (c) 2025. Encore Digital Group.
 * All Rights Reserved.
 */

/**
 * @packageDocumentation
 * Generic LINQ-style query builder for TypeScript
 *
 * @example
 * ```typescript
 * import { Query } from '@encoredigitalgroup/tslinq';
 *
 * const numbers = new Query([1, 2, 3, 4, 5]);
 * const result = numbers
 *   .where(n => n > 2)
 *   .orderBy(n => n)
 *   .take(2)
 *   .all();
 * // [3, 4]
 * ```
 *
 * @example
 * ```typescript
 * // Extend for domain-specific queries
 * import { Query } from '@encoredigitalgroup/tslinq';
 *
 * interface Product {
 *   type: 'physical' | 'digital';
 *   price: number;
 *   inStock: boolean;
 * }
 *
 * class ProductQuery extends Query<Product> {
 *   physical(): this {
 *     return this.where(p => p.type === 'physical');
 *   }
 *
 *   inStock(): this {
 *     return this.where(p => p.inStock);
 *   }
 *
 *   protected createInstance(items: Product[]): this {
 *     return new ProductQuery(items) as this;
 *   }
 * }
 * ```
 */

export {Query} from "./core/Query";
export type {KeySelector, Predicate, Queryable, QueryConfig, Selector, TypeFilterConfig} from "./core/types";
