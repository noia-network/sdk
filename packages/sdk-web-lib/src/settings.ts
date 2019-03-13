import { LoggerBuilder, LoggerConfiguration, LogLevel, ConsoleMessageHandler } from "simplr-logger";

export class Settings {
    public _masterUrl: string = "wss://csl-masters.noia.network:5566";
    private _log: boolean | undefined = undefined;
    private logger!: LoggerBuilder;

    constructor(log: boolean) {
        this.log = log;
    }

    public get masterUrl(): string {
        return this._masterUrl;
    }

    public set masterUrl(val: string) {
        if (this._masterUrl !== val) {
            this._masterUrl = val;
        }
    }

    public get log(): boolean {
        return this._log!;
    }

    public set log(val: boolean) {
        if (this._log !== val) {
            this.setLogger(val);
            this._log = val;
        }
    }

    protected static getLoggerConfig(log: boolean): LoggerConfiguration {
        const config: LoggerConfiguration = {
            DefaultLogLevel: {
                LogLevel: LogLevel.Trace,
                LogLevelIsBitMask: false
            },
            WriteMessageHandlers: [
                {
                    Handler: new ConsoleMessageHandler(),
                    LogLevel:
                        log === true
                            ? LogLevel.Critical | LogLevel.Debug | LogLevel.Information | LogLevel.Error | LogLevel.Trace | LogLevel.Warning
                            : LogLevel.None,
                    LogLevelIsBitMask: true
                }
            ]
        };
        return config;
    }

    private setLogger(log: boolean): LoggerBuilder {
        if (this.logger == null) {
            this.logger = new LoggerBuilder(Settings.getLoggerConfig(log));
        } else {
            this.logger = this.logger.UpdateConfiguration(builder => builder.Override(Settings.getLoggerConfig(log)).Build());
        }

        return this.logger;
    }

    public getLogger(): LoggerBuilder {
        return this.logger;
    }
}
