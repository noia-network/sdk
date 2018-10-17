export namespace Helpers {
    /**
     * @throws Promise has timed out.
     */
    export async function timeoutPromise(
        promise: PromiseLike<unknown>,
        time: number,
        errorMessage: string = "Promise has timed out."
    ): Promise<unknown> {
        let timeoutTimer: NodeJS.Timer | undefined;

        const timeout = new Promise<null>(resolve => {
            timeoutTimer = setTimeout(() => resolve(null), time);
        });

        const result = await Promise.race([promise, timeout]);

        if (result == null) {
            throw new Error(errorMessage);
        } else {
            if (timeoutTimer != null) {
                clearTimeout(timeoutTimer);
            }

            return result;
        }
    }
}
