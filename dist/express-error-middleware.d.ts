/// <reference types="express" />
import * as Express from "express";
export declare type ExpressLoggerOptions = {
    logLevel: LogLevel[];
};
export declare type TextColor = "red" | "yellow" | "blue";
export declare type LogLevel = "error" | "warning" | "info";
declare const _default: {
    errorHandlingMiddleware: (options: ExpressLoggerOptions) => (err: any, req: Express.Request, res: Express.Response, next: Express.NextFunction) => void;
    log: (kind: LogLevel, text: string) => void;
};
export default _default;
