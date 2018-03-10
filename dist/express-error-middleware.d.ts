/// <reference types="express" />
import * as Express from "express";
export declare type ExpressLoggerOptions = {
    logLevel: LogLevel[];
};
export declare type TextColor = "red" | "yellow" | "blue";
export declare type LogLevel = "error" | "warning" | "info";
export declare function errorHandlingMiddleware(options: ExpressLoggerOptions): (err: any, req: Express.Request, res: Express.Response, next: Express.NextFunction) => void;
export declare function log(kind: LogLevel, text: string): void;
