/*
 * Copyright (c) 2025. Encore Digital Group.
 * All Rights Reserved.
 */

/**
 * Generic LINQ-style query builder for TypeScript
 * Provides fluent, type-safe collection operations with method chaining
 *
 * @typeParam T - The type of items in the collection
 *
 * @example
 * ```typescript
 * const numbers = new Query([1, 2, 3, 4, 5]);
 * const result = numbers.where(n => n > 2).take(2).all();
 * // result: [3, 4]
 * ```
 *
 * @example
 * ```typescript
 * // Extend for domain-specific queries
 * class ProductQuery extends Query<Product> {
 *     inStock(): this {
 *         return this.where(p => p.inStock);
 *     }
 *
 *     protected createInstance(items: Product[]): this {
 *         return new ProductQuery(items) as this;
 *     }
 * }
 * ```
 */
export class Query<T> {
    protected items: T[];

    constructor(items: T[]) {
        this.items = items;
    }

    // ========== Filtering ==========

    /**
     * Filter items by custom predicate
     * @param predicate Function to test each item
     * @returns New Query with filtered items
     *
     * @example
     * ```typescript
     * const users = new Query([
     *     { name: 'Alice', age: 25 },
     *     { name: 'Bob', age: 30 }
     * ]);
     * const adults = users.where(u => u.age >= 18).all();
     * ```
     */
    where(predicate: (item: T) => boolean): this {
        return this.createInstance(this.items.filter(predicate));
    }

    // ========== Collection Operations ==========

    /**
     * Get the first item in the query results
     * @returns The first item, or null if no items match
     *
     * @example
     * ```typescript
     * const numbers = new Query([1, 2, 3]);
     * const first = numbers.first(); // 1
     * ```
     */
    first(): T | null {
        return this.items[0] ?? null;
    }

    /**
     * Get the first item or a default value if none found
     * @param defaultValue The default value to return if no items match
     * @returns The first item, or the default value
     *
     * @example
     * ```typescript
     * const empty = new Query([]);
     * const first = empty.firstOrDefault({ id: 0 }); // { id: 0 }
     * ```
     */
    firstOrDefault(defaultValue: T): T {
        return this.items[0] ?? defaultValue;
    }

    /**
     * Get the last item in the query results
     * @returns The last item, or null if no items match
     *
     * @example
     * ```typescript
     * const numbers = new Query([1, 2, 3]);
     * const last = numbers.last(); // 3
     * ```
     */
    last(): T | null {
        return this.items[this.items.length - 1] ?? null;
    }

    /**
     * Get the last item or a default value if none found
     * @param defaultValue The default value to return if no items match
     * @returns The last item, or the default value
     *
     * @example
     * ```typescript
     * const empty = new Query([]);
     * const last = empty.lastOrDefault({ id: 0 }); // { id: 0 }
     * ```
     */
    lastOrDefault(defaultValue: T): T {
        return this.items[this.items.length - 1] ?? defaultValue;
    }

    /**
     * Get a single item, throwing an error if multiple items match
     * @returns The single item, or null if no items match
     * @throws Error if more than one item matches
     *
     * @example
     * ```typescript
     * const users = new Query([{ id: 1, name: 'Alice' }]);
     * const user = users.single(); // { id: 1, name: 'Alice' }
     *
     * const multiple = new Query([{ id: 1 }, { id: 2 }]);
     * multiple.single(); // throws Error
     * ```
     */
    single(): T | null {
        if (this.items.length === 0) return null;
        if (this.items.length > 1) {
            throw new Error("Sequence contains more than one element");
        }
        return this.items[0];
    }

    /**
     * Get all items as an array
     * @returns Array of all matching items
     *
     * @example
     * ```typescript
     * const numbers = new Query([1, 2, 3]);
     * const filtered = numbers.where(n => n > 1).all(); // [2, 3]
     * ```
     */
    all(): T[] {
        return [...this.items];
    }

    /**
     * Count the number of matching items
     * @returns The count of matching items
     *
     * @example
     * ```typescript
     * const numbers = new Query([1, 2, 3, 4, 5]);
     * const count = numbers.where(n => n > 2).count(); // 3
     * ```
     */
    count(): number {
        return this.items.length;
    }

    /**
     * Check if any items match the query
     * @returns True if at least one item matches
     *
     * @example
     * ```typescript
     * const numbers = new Query([1, 2, 3]);
     * const hasEven = numbers.where(n => n % 2 === 0).any(); // true
     * ```
     */
    any(): boolean {
        return this.items.length > 0;
    }

    // ========== Ordering ==========

    /**
     * Order items by a selector function (ascending)
     * @param selector Function to extract the value to sort by
     * @returns New Query with sorted items
     *
     * @example
     * ```typescript
     * const users = new Query([
     *     { name: 'Charlie', age: 25 },
     *     { name: 'Alice', age: 30 },
     *     { name: 'Bob', age: 20 }
     * ]);
     * const sorted = users.orderBy(u => u.age).all();
     * // [{ name: 'Bob', age: 20 }, { name: 'Charlie', age: 25 }, { name: 'Alice', age: 30 }]
     * ```
     */
    orderBy(selector: (item: T) => any): this {
        const sorted = [...this.items].sort((a, b) => {
            const aVal = selector(a);
            const bVal = selector(b);
            return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        });
        return this.createInstance(sorted);
    }

    /**
     * Order items by a selector function (descending)
     * @param selector Function to extract the value to sort by
     * @returns New Query with sorted items
     *
     * @example
     * ```typescript
     * const users = new Query([
     *     { name: 'Alice', age: 20 },
     *     { name: 'Bob', age: 30 }
     * ]);
     * const sorted = users.orderByDescending(u => u.age).all();
     * // [{ name: 'Bob', age: 30 }, { name: 'Alice', age: 20 }]
     * ```
     */
    orderByDescending(selector: (item: T) => any): this {
        const sorted = [...this.items].sort((a, b) => {
            const aVal = selector(a);
            const bVal = selector(b);
            return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
        });
        return this.createInstance(sorted);
    }

    // ========== Utilities ==========

    /**
     * Skip the first N items
     * @param count Number of items to skip
     * @returns New Query with remaining items
     *
     * @example
     * ```typescript
     * const numbers = new Query([1, 2, 3, 4, 5]);
     * const skipped = numbers.skip(2).all(); // [3, 4, 5]
     * ```
     */
    skip(count: number): this {
        return this.createInstance(this.items.slice(count));
    }

    /**
     * Take only the first N items
     * @param count Number of items to take
     * @returns New Query with the first N items
     *
     * @example
     * ```typescript
     * const numbers = new Query([1, 2, 3, 4, 5]);
     * const topThree = numbers.take(3).all(); // [1, 2, 3]
     * ```
     */
    take(count: number): this {
        return this.createInstance(this.items.slice(0, count));
    }

    // ========== Advanced Operations ==========

    /**
     * Transform items using a selector function
     * @param selector Function to transform each item
     * @returns New Query with transformed items
     *
     * @example
     * ```typescript
     * const users = new Query([
     *     { name: 'Alice', age: 25 },
     *     { name: 'Bob', age: 30 }
     * ]);
     * const names = users.select(u => u.name).all(); // ['Alice', 'Bob']
     * ```
     */
    select<TResult>(selector: (item: T) => TResult): Query<TResult> {
        return new Query(this.items.map(selector));
    }

    /**
     * Group items by a key selector
     * @param keySelector Function to extract the grouping key
     * @returns Map of grouped items
     *
     * @example
     * ```typescript
     * const users = new Query([
     *     { name: 'Alice', department: 'Engineering' },
     *     { name: 'Bob', department: 'Sales' },
     *     { name: 'Charlie', department: 'Engineering' }
     * ]);
     * const groups = users.groupBy(u => u.department);
     * // Map {
     * //   'Engineering' => [{ name: 'Alice', ... }, { name: 'Charlie', ... }],
     * //   'Sales' => [{ name: 'Bob', ... }]
     * // }
     * ```
     */
    groupBy<TKey>(keySelector: (item: T) => TKey): Map<TKey, T[]> {
        const groups = new Map<TKey, T[]>();
        for (const item of this.items) {
            const key = keySelector(item);
            const group = groups.get(key) ?? [];
            group.push(item);
            groups.set(key, group);
        }
        return groups;
    }

    /**
     * Check if all items match a predicate
     * @param predicate Function to test each item
     * @returns True if all items match
     *
     * @example
     * ```typescript
     * const numbers = new Query([2, 4, 6, 8]);
     * const allEven = numbers.every(n => n % 2 === 0); // true
     * ```
     */
    every(predicate: (item: T) => boolean): boolean {
        return this.items.every(predicate);
    }

    /**
     * Find the first item matching a predicate
     * @param predicate Function to test each item
     * @returns The first matching item, or null
     *
     * @example
     * ```typescript
     * const users = new Query([
     *     { name: 'Alice', age: 25 },
     *     { name: 'Bob', age: 30 }
     * ]);
     * const found = users.find(u => u.age > 25); // { name: 'Bob', age: 30 }
     * ```
     */
    find(predicate: (item: T) => boolean): T | null {
        return this.items.find(predicate) ?? null;
    }

    /**
     * Get distinct items
     * @param selector Optional selector for comparison
     * @returns New Query with distinct items
     *
     * @example
     * ```typescript
     * const numbers = new Query([1, 2, 2, 3, 3, 3]);
     * const unique = numbers.distinct().all(); // [1, 2, 3]
     *
     * const users = new Query([
     *     { id: 1, name: 'Alice' },
     *     { id: 1, name: 'Alice (duplicate)' },
     *     { id: 2, name: 'Bob' }
     * ]);
     * const uniqueUsers = users.distinct(u => u.id).all();
     * // [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
     * ```
     */
    distinct(selector?: (item: T) => any): this {
        if (!selector) {
            return this.createInstance([...new Set(this.items)]);
        }

        const seen = new Set();
        const distinct = this.items.filter(item => {
            const key = selector(item);
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
        return this.createInstance(distinct);
    }

    // ========== Extensibility ==========

    /**
     * Factory method for creating new instances
     * Override in derived classes to preserve type and additional state
     *
     * @protected
     * @param items The items for the new instance
     * @returns New instance of the query class
     *
     * @example
     * ```typescript
     * class ProductQuery extends Query<Product> {
     *     private config: Config;
     *
     *     constructor(items: Product[], config: Config) {
     *         super(items);
     *         this.config = config;
     *     }
     *
     *     // Override to preserve both type AND config state
     *     protected createInstance(items: Product[]): this {
     *         return new ProductQuery(items, this.config) as this;
     *     }
     * }
     * ```
     */
    protected createInstance(items: T[]): this {
        return new (this.constructor as any)(items) as this;
    }
}
