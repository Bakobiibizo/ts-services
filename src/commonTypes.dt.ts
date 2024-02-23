export class GenericList<T> {
    private items: T[] = [];

    addItem(item: T): void {
        this.items.push(item);
    }

    getItems(): T[] {
        return this.items
    }

    getItem(key: string): any {
        if (!key) {
            return this.items[0];
        }
        else {
            return this.setItems(this.items.find((item) => item === key) || this.items[0]);
        }
    }

    setItems(...items: T[]): void {
        this.items = [...items];
    }

    deleteItem(item: T): void {
        const index = this.items.indexOf(item);
        if (index > -1) {
            this.items.splice(index, 1);
        }
    }
    updateItem(item: T): void {
        const index = this.items.indexOf(item);
        if (index > -1) {
            this.setItems(item);
        }
    }
}
