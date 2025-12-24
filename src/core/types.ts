/*
 * Copyright (c) 2025. Encore Digital Group.
 * All Rights Reserved.
 */

/**
 * Base interface that queryable items can extend
 * Provides a common contract for type-based filtering
 *
 * @example
 * ```typescript
 * interface Product extends Queryable {
 *     type: 'physical' | 'digital' | 'subscription';
 *     name: string;
 *     price: number;
 * }
 * ```
 */
export interface Queryable {
    type: string;
    [key: string]: any;
}

/**
 * Configuration for creating domain-specific queries
 *
 * @typeParam T - The type of items in the collection
 *
 * @example
 * ```typescript
 * const config: QueryConfig<Product> = {
 *     createInstance: (items) => new ProductQuery(items)
 * };
 * ```
 */
export interface QueryConfig<T> {
    /**
     * Optional custom constructor for creating new query instances
     * Useful when extending Query with domain-specific methods
     */
    createInstance?: (items: T[]) => any;
}

/**
 * Type filter configuration for domain-specific implementations
 *
 * @typeParam TBase - The base type of items
 * @typeParam TSpecific - The specific type after filtering
 * @typeParam TContent - Optional content type associated with the item
 *
 * @example
 * ```typescript
 * const sectionFilter: TypeFilterConfig<AnyBlock, SectionBlock, SectionData> = {
 *     typeValue: "section",
 *     contentExtractor: (block) => block.content as SectionData
 * };
 * ```
 */
export interface TypeFilterConfig<TBase, TSpecific extends TBase, TContent = any> {
    /**
     * The type discriminator value (e.g., "section", "accordion")
     */
    typeValue: string;

    /**
     * Optional content extractor function
     */
    contentExtractor?: (item: TSpecific) => TContent;
}

/**
 * Predicate function type for filtering items
 *
 * @typeParam T - The type of items being filtered
 */
export type Predicate<T> = (item: T) => boolean;

/**
 * Selector function type for extracting values from items
 *
 * @typeParam T - The type of items
 * @typeParam TResult - The type of the extracted value
 */
export type Selector<T, TResult> = (item: T) => TResult;

/**
 * Key selector function type for grouping operations
 *
 * @typeParam T - The type of items
 * @typeParam TKey - The type of the grouping key
 */
export type KeySelector<T, TKey> = (item: T) => TKey;
