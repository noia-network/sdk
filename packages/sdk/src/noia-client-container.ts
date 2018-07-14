import { NoiaClient } from "./noia-client";

class NoiaClientContainerClass {
    private instance: NoiaClient | undefined;

    public initialize(newHandler: NoiaClient): void {
        if (this.instance != null) {
            delete this.instance;
        }

        this.instance = newHandler;
    }

    public getClient(): NoiaClient {
        if (this.instance == null) {
            throw new Error("NoiaClient is not initialized.");
        }
        return this.instance;
    }
}

export const NoiaClientContainer = new NoiaClientContainerClass();
