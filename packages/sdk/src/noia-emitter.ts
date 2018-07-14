import { NoiaEmitter as NoiaEmitterInterface, FileInfo } from "./contracts";
import { EventEmitter } from "fbemitter";
import { Deferred } from "ts-deferred";

export class NoiaEmitter extends EventEmitter implements NoiaEmitterInterface {
    constructor() {
        super();

        const thisNoiaEmitter: NoiaEmitterInterface = this;

        const fileInfoDeferred = new Deferred<FileInfo>();
        this.fileInfo = fileInfoDeferred.promise;
        thisNoiaEmitter.addListener("fileInfo", fileInfo => {
            fileInfoDeferred.resolve(fileInfo);
        });
    }

    public fileInfo: Promise<FileInfo>;
}
