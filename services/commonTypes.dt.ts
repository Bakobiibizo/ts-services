export class GenericList<T> {
    private items: T[] = [];

    addItem(item: T): void {
        this.items.push(item);
    }

    getItems(): T[] {
        return this.items;
    }

    setItems(items: T[]): void {
        this.items = [...items];
    }
}
