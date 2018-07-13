declare module "simple-sha1" {
    namespace sha1 {
        function sync(data: string): string;
    }

    function sha1(data: string | Buffer, callback: (hash: string) => void): void;
    export = sha1;
}
