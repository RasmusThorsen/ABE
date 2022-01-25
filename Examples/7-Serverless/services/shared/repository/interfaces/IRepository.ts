export interface IRepository<T, U> {
    get(keys: U): Promise<T>;
    getAll(key: {[keyName: string]: string}, query: string[]): Promise<Array<T>>;
    
    // TODO: Could be implemented in the future
    // find(predicate: (entity: T) => boolean): Promise<Array<T>>;

    add(entity: T): Promise<T | null>;
    update(entity: T): Promise<boolean>;
    addRange(entities: Array<T>): Promise<void>;

    remove(keys: U): Promise<boolean>;
    removeRange(keys: U[]): Promise<void>;
}