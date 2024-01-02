export class GenericList<T> {
    private items: T[] = [];

    addItem(item: T): void {
        this.setItems(item)
    }

    getItems(): T[] {
        return this.items
    }

    getItem(item: T): T {
        if (!item) {
            return this.items[0];
        }
        else {
            // @ts-ignore
            return this.items.find((item = item) => item === item);
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
