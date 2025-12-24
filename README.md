# @encoredigitalgroup/tslinq

A generic LINQ-style query builder for TypeScript with fluent, type-safe collection operations. Build powerful, domain-specific query APIs in under 100 lines of code.

## Features

- **Type-Safe**: Full TypeScript support with proper type inference
- **Fluent API**: Method chaining for readable, expressive queries
- **Extensible**: Easy to build domain-specific query builders
- **Zero Dependencies**: Lightweight and self-contained
- **Immutable**: All operations return new instances
- **Well-Tested**: Comprehensive test coverage

## Installation

```bash
npm install @encoredigitalgroup/tslinq
```

## Quick Start

```typescript
import {Query} from '@encoredigitalgroup/tslinq';

const numbers = new Query([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

const result = numbers
    .where(n => n > 5)
    .orderByDescending(n => n)
    .take(3)
    .all();

console.log(result); // [10, 9, 8]
```

## Core API

### Filtering

#### `where(predicate: (item: T) => boolean): this`

Filter items by custom predicate.

```typescript
const adults = users.where(u => u.age >= 18).all();
```

### Terminal Operations

#### `first(): T | null`

Get the first item, or null if empty.

```typescript
const firstUser = users.first();
```

#### `firstOrDefault(defaultValue: T): T`

Get the first item, or a default value if empty.

```typescript
const firstUser = users.firstOrDefault({id: 0, name: 'Guest'});
```

#### `last(): T | null`

Get the last item, or null if empty.

```typescript
const lastUser = users.last();
```

#### `lastOrDefault(defaultValue: T): T`

Get the last item, or a default value if empty.

```typescript
const lastUser = users.lastOrDefault({id: 0, name: 'Guest'});
```

#### `single(): T | null`

Get the single item, throwing an error if multiple items exist.

```typescript
const user = users.where(u => u.id === 123).single();
```

#### `all(): T[]`

Get all items as an array.

```typescript
const allUsers = users.all();
```

#### `count(): number`

Count the number of items.

```typescript
const userCount = users.count();
```

#### `any(): boolean`

Check if any items exist.

```typescript
const hasUsers = users.any();
```

### Ordering

#### `orderBy(selector: (item: T) => any): this`

Order items by selector (ascending).

```typescript
const sorted = users.orderBy(u => u.name).all();
```

#### `orderByDescending(selector: (item: T) => any): this`

Order items by selector (descending).

```typescript
const sorted = users.orderByDescending(u => u.createdAt).all();
```

### Pagination

#### `skip(count: number): this`

Skip the first N items.

```typescript
const page2 = users.skip(10).take(10).all();
```

#### `take(count: number): this`

Take only the first N items.

```typescript
const topTen = users.take(10).all();
```

### Transformations

#### `select<TResult>(selector: (item: T) => TResult): Query<TResult>`

Transform items using a selector function.

```typescript
const names = users.select(u => u.name).all();
```

#### `distinct(selector?: (item: T) => any): this`

Get unique items, optionally by a selector.

```typescript
const uniqueNames = users.distinct(u => u.name).all();
```

### Advanced Operations

#### `groupBy<TKey>(keySelector: (item: T) => TKey): Map<TKey, T[]>`

Group items by a key selector.

```typescript
const byDepartment = users.groupBy(u => u.department);
```

#### `every(predicate: (item: T) => boolean): boolean`

Check if all items match a predicate.

```typescript
const allAdults = users.every(u => u.age >= 18);
```

#### `find(predicate: (item: T) => boolean): T | null`

Find the first item matching a predicate.

```typescript
const user = users.find(u => u.email === 'alice@example.com');
```

## Building Domain-Specific Queries

The real power of tslinq comes from building domain-specific query builders tailored to your application's needs.

### Example 1: E-commerce Product Query

```typescript
import {Query} from '@encoredigitalgroup/tslinq';

interface Product {
    type: 'physical' | 'digital' | 'subscription';
    price: number;
    inStock: boolean;
    tags: string[];
    rating: number;
}

class ProductQuery extends Query<Product> {
    // Type filters
    physical(): this {
        return this.where(p => p.type === 'physical');
    }

    digital(): this {
        return this.where(p => p.type === 'digital');
    }

    // Property filters
    inStock(): this {
        return this.where(p => p.inStock);
    }

    priceRange(min: number, max: number): this {
        return this.where(p => p.price >= min && p.price <= max);
    }

    withTag(tag: string): this {
        return this.where(p => p.tags.includes(tag));
    }

    withMinRating(minRating: number): this {
        return this.where(p => p.rating >= minRating);
    }

    // Custom ordering
    orderByPrice(): this {
        return this.orderBy(p => p.price);
    }

    // Aggregations
    averagePrice(): number {
        if (this.items.length === 0) return 0;
        return this.items.reduce((sum, p) => sum + p.price, 0) / this.items.length;
    }

    // IMPORTANT: Override to preserve ProductQuery type
    protected createInstance(items: Product[]): this {
        return new ProductQuery(items) as this;
    }
}

// Usage
const products = new ProductQuery([/* ... */]);

const featured = products
    .digital()
    .inStock()
    .priceRange(10, 50)
    .withTag('featured')
    .withMinRating(4.5)
    .orderByPrice()
    .take(5)
    .all();
```

### Example 2: Content Block Query

```typescript
interface Block {
    type: 'section' | 'card' | 'accordion';
    metadata?: {
        key?: string;
        variant?: string;
    };
}

class BlockQuery<TBlock extends Block = Block> extends Query<TBlock> {
    sections(): BlockQuery<SectionBlock> {
        return this.filterByType('section');
    }

    cards(): BlockQuery<CardBlock> {
        return this.filterByType('card');
    }

    withKey(key: string): this {
        return this.where(b => b.metadata?.key === key);
    }

    withVariant(variant: string): this {
        return this.where(b => b.metadata?.variant === variant);
    }

    private filterByType<T extends Block>(type: string): BlockQuery<T> {
        const filtered = this.items.filter(b => b.type === type) as T[];
        return new BlockQuery<T>(filtered) as any;
    }

    protected createInstance(items: TBlock[]): this {
        return new BlockQuery(items) as this;
    }
}

// Usage
const blocks = new BlockQuery([/* ... */]);

const hero = blocks.sections().withKey('hero').first();
const featuredCards = blocks.cards().withVariant('featured').take(3).all();
```

## Extension Pattern

When extending `Query`, follow this pattern:

1. **Extend the Query class**
   ```typescript
   class MyQuery<T> extends Query<T> {
   ```

2. **Add domain-specific methods**
   ```typescript
   myFilter(): this {
     return this.where(item => /* your logic */);
   }
   ```

3. **Override `createInstance()` to preserve your type**
   ```typescript
   protected createInstance(items: T[]): this {
     return new MyQuery(items) as this;
   }
   ```

4. **If you have additional state, preserve it**
   ```typescript
   class MyQuery<T> extends Query<T> {
     private config: Config;

     constructor(items: T[], config: Config) {
       super(items);
       this.config = config;
     }

     protected createInstance(items: T[]): this {
       return new MyQuery(items, this.config) as this;
     }
   }
   ```

## Why Override `createInstance()`?

The `createInstance()` method is crucial for preserving your derived query type through method chains:

```typescript
// Without override
const products = new ProductQuery([...]);
const result = products.where(p => p.inStock); // Returns Query<Product>, not ProductQuery
result.digital(); // ERROR: digital() doesn't exist on Query

// With override
const products = new ProductQuery([...]);
const result = products.where(p => p.inStock); // Returns ProductQuery
result.digital(); // ✓ Works! Returns ProductQuery
```

By overriding `createInstance()`, all inherited methods (where, orderBy, skip, take, etc.) automatically return your custom query type, enabling full method chaining with
your domain-specific methods.

## Examples

See the [examples directory](./src/examples) for complete, runnable examples:

- **BlockQueryExample.ts** - Content management system queries
- **ProductQueryExample.ts** - E-commerce product catalog queries

## API Reference

### Query<T>

Generic LINQ-style query builder for TypeScript.

**Type Parameters:**

- `T` - The type of items in the collection

**Constructor:**

- `constructor(items: T[])`

**Methods:**
See [Core API](#core-api) section above for complete method documentation.

### Types

```typescript
import type {
    Queryable,
    QueryConfig,
    TypeFilterConfig,
    Predicate,
    Selector,
    KeySelector
} from '@encoredigitalgroup/tslinq';
```

#### `Queryable`

Base interface for items with type discrimination.

```typescript
interface Queryable {
    type: string;

    [key: string]: any;
}
```

#### `Predicate<T>`

Function type for filtering items.

```typescript
type Predicate<T> = (item: T) => boolean;
```

#### `Selector<T, TResult>`

Function type for transforming items.

```typescript
type Selector<T, TResult> = (item: T) => TResult;
```

#### `KeySelector<T, TKey>`

Function type for extracting grouping keys.

```typescript
type KeySelector<T, TKey> = (item: T) => TKey;
```

## Performance Considerations

- All operations are **immutable** - they create new query instances
- Operations are **lazy** until a terminal operation is called (first, all, count, etc.)
- For large collections, consider using streams or generators for better memory efficiency
- The `distinct()` operation uses a `Set` internally for O(n) performance

## TypeScript Configuration

This package requires TypeScript 5.0 or higher with the following compiler options:

```json
{
    "compilerOptions": {
        "strict": true,
        "esModuleInterop": true,
        "skipLibCheck": true
    }
}
```

## Contributing

Contributions are welcome! Please ensure:

1. All code has proper TypeScript types
2. Tests cover new functionality
3. Examples demonstrate real-world usage
4. Documentation is updated

## Support

For issues and questions, please open an issue on [GitHub](https://github.com/encoredigitalgroup/tslinq/issues).
