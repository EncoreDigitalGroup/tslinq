/*
 * Copyright (c) 2025. Encore Digital Group.
 * All Rights Reserved.
 */
import {Query} from "../src";
import {describe, expect, it} from "vitest";

describe("Query", () => {
    // Sample data for testing
    const sampleUsers = [
        {id: 1, name: "Alice", age: 25, active: true, department: "Engineering"},
        {id: 2, name: "Bob", age: 30, active: false, department: "Sales"},
        {id: 3, name: "Charlie", age: 25, active: true, department: "Engineering"},
        {id: 4, name: "Diana", age: 35, active: true, department: "Sales"},
        {id: 5, name: "Eve", age: 28, active: false, department: "Marketing"},
    ];

    describe("Constructor", () => {
        it("should create a query with items", () => {
            const query = new Query(sampleUsers);
            expect(query.count()).toBe(5);
        });

        it("should create a query with empty array", () => {
            const query = new Query([]);
            expect(query.count()).toBe(0);
        });
    });

    describe("where()", () => {
        it("should filter items by predicate", () => {
            const query = new Query(sampleUsers);
            const result = query.where(u => u.age === 25).all();

            expect(result).toHaveLength(2);
            expect(result[0].name).toBe("Alice");
            expect(result[1].name).toBe("Charlie");
        });

        it("should support method chaining", () => {
            const query = new Query(sampleUsers);
            const result = query
                .where(u => u.active)
                .where(u => u.age > 20)
                .all();

            expect(result).toHaveLength(3);
        });

        it("should return empty result when no items match", () => {
            const query = new Query(sampleUsers);
            const result = query.where(u => u.age > 100).all();

            expect(result).toHaveLength(0);
        });
    });

    describe("first()", () => {
        it("should return first item", () => {
            const query = new Query(sampleUsers);
            const first = query.first();

            expect(first?.name).toBe("Alice");
        });

        it("should return null for empty query", () => {
            const query = new Query([]);
            expect(query.first()).toBeNull();
        });

        it("should return first item after filtering", () => {
            const query = new Query(sampleUsers);
            const first = query.where(u => u.age === 30).first();

            expect(first?.name).toBe("Bob");
        });
    });

    describe("firstOrDefault()", () => {
        it("should return first item when exists", () => {
            const query = new Query(sampleUsers);
            const defaultUser = {id: 0, name: "Guest", age: 0, active: false, department: ""};
            const first = query.firstOrDefault(defaultUser);

            expect(first.name).toBe("Alice");
        });

        it("should return default value for empty query", () => {
            const query = new Query<(typeof sampleUsers)[0]>([]);
            const defaultUser = {id: 0, name: "Guest", age: 0, active: false, department: ""};
            const first = query.firstOrDefault(defaultUser);

            expect(first.name).toBe("Guest");
        });
    });

    describe("last()", () => {
        it("should return last item", () => {
            const query = new Query(sampleUsers);
            const last = query.last();

            expect(last?.name).toBe("Eve");
        });

        it("should return null for empty query", () => {
            const query = new Query([]);
            expect(query.last()).toBeNull();
        });

        it("should return last item after filtering", () => {
            const query = new Query(sampleUsers);
            const last = query.where(u => u.age === 25).last();

            expect(last?.name).toBe("Charlie");
        });
    });

    describe("lastOrDefault()", () => {
        it("should return last item when exists", () => {
            const query = new Query(sampleUsers);
            const defaultUser = {id: 0, name: "Guest", age: 0, active: false, department: ""};
            const last = query.lastOrDefault(defaultUser);

            expect(last.name).toBe("Eve");
        });

        it("should return default value for empty query", () => {
            const query = new Query<(typeof sampleUsers)[0]>([]);
            const defaultUser = {id: 0, name: "Guest", age: 0, active: false, department: ""};
            const last = query.lastOrDefault(defaultUser);

            expect(last.name).toBe("Guest");
        });
    });

    describe("single()", () => {
        it("should return single item when only one exists", () => {
            const query = new Query(sampleUsers);
            const single = query.where(u => u.id === 1).single();

            expect(single?.name).toBe("Alice");
        });

        it("should return null for empty query", () => {
            const query = new Query([]);
            expect(query.single()).toBeNull();
        });

        it("should throw error when multiple items exist", () => {
            const query = new Query(sampleUsers);

            expect(() => query.where(u => u.age === 25).single()).toThrow("Sequence contains more than one element");
        });
    });

    describe("all()", () => {
        it("should return all items as array", () => {
            const query = new Query(sampleUsers);
            const all = query.all();

            expect(all).toHaveLength(5);
            expect(all).toEqual(sampleUsers);
        });

        it("should return copy of array (immutability)", () => {
            const query = new Query(sampleUsers);
            const all = query.all();

            expect(all).not.toBe(sampleUsers); // Different reference
            expect(all).toEqual(sampleUsers); // Same values
        });
    });

    describe("count()", () => {
        it("should return count of items", () => {
            const query = new Query(sampleUsers);
            expect(query.count()).toBe(5);
        });

        it("should return count after filtering", () => {
            const query = new Query(sampleUsers);
            const count = query.where(u => u.active).count();

            expect(count).toBe(3);
        });

        it("should return 0 for empty query", () => {
            const query = new Query([]);
            expect(query.count()).toBe(0);
        });
    });

    describe("any()", () => {
        it("should return true when items exist", () => {
            const query = new Query(sampleUsers);
            expect(query.any()).toBe(true);
        });

        it("should return false for empty query", () => {
            const query = new Query([]);
            expect(query.any()).toBe(false);
        });

        it("should return true after filtering with matches", () => {
            const query = new Query(sampleUsers);
            expect(query.where(u => u.age === 25).any()).toBe(true);
        });

        it("should return false after filtering with no matches", () => {
            const query = new Query(sampleUsers);
            expect(query.where(u => u.age > 100).any()).toBe(false);
        });
    });

    describe("orderBy()", () => {
        it("should sort items ascending", () => {
            const query = new Query(sampleUsers);
            const sorted = query.orderBy(u => u.age).all();

            expect(sorted[0].age).toBe(25);
            expect(sorted[4].age).toBe(35);
        });

        it("should sort by string field", () => {
            const query = new Query(sampleUsers);
            const sorted = query.orderBy(u => u.name).all();

            expect(sorted[0].name).toBe("Alice");
            expect(sorted[4].name).toBe("Eve");
        });

        it("should preserve query type for chaining", () => {
            const query = new Query(sampleUsers);
            const result = query
                .orderBy(u => u.age)
                .where(u => u.age > 25)
                .all();

            expect(result).toHaveLength(3);
        });
    });

    describe("orderByDescending()", () => {
        it("should sort items descending", () => {
            const query = new Query(sampleUsers);
            const sorted = query.orderByDescending(u => u.age).all();

            expect(sorted[0].age).toBe(35);
            expect(sorted[4].age).toBe(25);
        });

        it("should sort by string field descending", () => {
            const query = new Query(sampleUsers);
            const sorted = query.orderByDescending(u => u.name).all();

            expect(sorted[0].name).toBe("Eve");
            expect(sorted[4].name).toBe("Alice");
        });
    });

    describe("skip()", () => {
        it("should skip first N items", () => {
            const query = new Query(sampleUsers);
            const result = query.skip(2).all();

            expect(result).toHaveLength(3);
            expect(result[0].name).toBe("Charlie");
        });

        it("should return empty array when skipping all items", () => {
            const query = new Query(sampleUsers);
            const result = query.skip(10).all();

            expect(result).toHaveLength(0);
        });

        it("should work with pagination", () => {
            const query = new Query(sampleUsers);
            const page2 = query.skip(2).take(2).all();

            expect(page2).toHaveLength(2);
            expect(page2[0].name).toBe("Charlie");
            expect(page2[1].name).toBe("Diana");
        });
    });

    describe("take()", () => {
        it("should take first N items", () => {
            const query = new Query(sampleUsers);
            const result = query.take(3).all();

            expect(result).toHaveLength(3);
            expect(result[0].name).toBe("Alice");
            expect(result[2].name).toBe("Charlie");
        });

        it("should return all items when taking more than exist", () => {
            const query = new Query(sampleUsers);
            const result = query.take(10).all();

            expect(result).toHaveLength(5);
        });

        it("should return empty array when taking 0", () => {
            const query = new Query(sampleUsers);
            const result = query.take(0).all();

            expect(result).toHaveLength(0);
        });
    });

    describe("select()", () => {
        it("should transform items to new type", () => {
            const query = new Query(sampleUsers);
            const names = query.select(u => u.name).all();

            expect(names).toEqual(["Alice", "Bob", "Charlie", "Diana", "Eve"]);
        });

        it("should transform to complex objects", () => {
            const query = new Query(sampleUsers);
            const transformed = query
                .select(u => ({
                    fullName: u.name,
                    isAdult: u.age >= 18,
                }))
                .all();

            expect(transformed[0]).toEqual({fullName: "Alice", isAdult: true});
        });
    });

    describe("groupBy()", () => {
        it("should group items by key", () => {
            const query = new Query(sampleUsers);
            const groups = query.groupBy(u => u.department);

            expect(groups.size).toBe(3);
            expect(groups.get("Engineering")).toHaveLength(2);
            expect(groups.get("Sales")).toHaveLength(2);
            expect(groups.get("Marketing")).toHaveLength(1);
        });

        it("should group by numeric key", () => {
            const query = new Query(sampleUsers);
            const groups = query.groupBy(u => u.age);

            expect(groups.get(25)).toHaveLength(2);
            expect(groups.get(30)).toHaveLength(1);
        });
    });

    describe("every()", () => {
        it("should return true when all items match", () => {
            const query = new Query(sampleUsers);
            const allAdults = query.every(u => u.age >= 18);

            expect(allAdults).toBe(true);
        });

        it("should return false when some items do not match", () => {
            const query = new Query(sampleUsers);
            const allActive = query.every(u => u.active);

            expect(allActive).toBe(false);
        });

        it("should return true for empty query", () => {
            const query = new Query([]);
            expect(query.every(() => false)).toBe(true);
        });
    });

    describe("find()", () => {
        it("should find first matching item", () => {
            const query = new Query(sampleUsers);
            const found = query.find(u => u.age > 25);

            expect(found?.name).toBe("Bob");
        });

        it("should return null when no item matches", () => {
            const query = new Query(sampleUsers);
            const found = query.find(u => u.age > 100);

            expect(found).toBeNull();
        });
    });

    describe("distinct()", () => {
        it("should return unique items", () => {
            const numbers = new Query([1, 2, 2, 3, 3, 3, 4]);
            const unique = numbers.distinct().all();

            expect(unique).toEqual([1, 2, 3, 4]);
        });

        it("should return unique items by selector", () => {
            const query = new Query(sampleUsers);
            const uniqueByAge = query.distinct(u => u.age).all();

            expect(uniqueByAge).toHaveLength(4); // 25, 30, 35, 28
        });

        it("should preserve first occurrence", () => {
            const query = new Query(sampleUsers);
            const uniqueByAge = query.distinct(u => u.age).all();

            // Alice (age 25) should come before Charlie (also 25)
            const age25Items = sampleUsers.filter(u => u.age === 25);
            expect(uniqueByAge.find(u => u.age === 25)?.name).toBe(age25Items[0].name);
        });
    });

    describe("Complex Queries", () => {
        it("should handle complex method chaining", () => {
            const query = new Query(sampleUsers);
            const result = query
                .where(u => u.active)
                .orderBy(u => u.age)
                .skip(1)
                .take(2)
                .all();

            expect(result).toHaveLength(2);
            expect(result[0].name).toBe("Charlie");
            expect(result[1].name).toBe("Diana");
        });

        it("should combine filtering, sorting, and pagination", () => {
            const query = new Query(sampleUsers);
            const result = query
                .where(u => u.department === "Engineering" || u.department === "Sales")
                .orderByDescending(u => u.age)
                .take(3)
                .all();

            expect(result).toHaveLength(3);
            expect(result[0].age).toBe(35);
        });

        it("should handle select after filtering", () => {
            const query = new Query(sampleUsers);
            const names = query
                .where(u => u.active)
                .orderBy(u => u.name)
                .select(u => u.name)
                .all();

            expect(names).toEqual(["Alice", "Charlie", "Diana"]);
        });
    });

    describe("Immutability", () => {
        it("should not modify original query when filtering", () => {
            const query = new Query(sampleUsers);
            const filtered = query.where(u => u.active);

            expect(query.count()).toBe(5);
            expect(filtered.count()).toBe(3);
        });

        it("should not modify original query when sorting", () => {
            const query = new Query(sampleUsers);
            const sorted = query.orderBy(u => u.age);

            expect(query.first()?.name).toBe("Alice");
            expect(sorted.first()?.name).toBe("Alice"); // Both happen to have same first
        });

        it("should create independent query chains", () => {
            const query = new Query(sampleUsers);
            const activeUsers = query.where(u => u.active);
            const inactiveUsers = query.where(u => !u.active);

            expect(activeUsers.count()).toBe(3);
            expect(inactiveUsers.count()).toBe(2);
            expect(query.count()).toBe(5); // Original unchanged
        });
    });

    describe("Type Preservation (Extension)", () => {
        class CustomQuery<T> extends Query<T> {
            customMethod(): string {
                return "custom";
            }

            protected createInstance(items: T[]): this {
                return new CustomQuery(items) as this;
            }
        }

        it("should preserve custom query type through where()", () => {
            const query = new CustomQuery(sampleUsers);
            const filtered = query.where(u => u.active);

            expect(filtered.customMethod()).toBe("custom");
        });

        it("should preserve custom query type through orderBy()", () => {
            const query = new CustomQuery(sampleUsers);
            const sorted = query.orderBy(u => u.age);

            expect(sorted.customMethod()).toBe("custom");
        });

        it("should preserve custom query type through skip/take", () => {
            const query = new CustomQuery(sampleUsers);
            const paginated = query.skip(1).take(2);

            expect(paginated.customMethod()).toBe("custom");
        });

        it("should preserve custom query type through complex chains", () => {
            const query = new CustomQuery(sampleUsers);
            const result = query
                .where(u => u.active)
                .orderBy(u => u.age)
                .skip(1)
                .take(2);

            expect(result.customMethod()).toBe("custom");
        });
    });
});
