import * as Express from "express"
import * as Statuses from "statuses"

export type ErrorHandlingMiddlewareOptions = {
    logLevel: LogLevel[]
}
export type TextColor = "red" | "yellow" | "blue"
export type LogLevel = "error" | "warning" | "info"

class ErrorHandlingMiddleware {
    color(color: TextColor, text: string): string {
        switch (color) {
            case "red":
                return `\x1b[31m${text}\x1b[0m`
            case "yellow":
                return `\x1b[33m${text}\x1b[0m`
            case "blue":
                return `\x1b[34m${text}\x1b[0m`
        }
    }

    statusToMessage(number: number): string {
        return Statuses[number] ? Statuses[number] : "Unknown status " + number
    }

    log(kind: LogLevel, text: string): void {
        let prefix = kind == "error" ? this.color("red", "ERROR") : kind == "warning" ? this.color("yellow", "WARNING") : this.color("blue", "INFO")

        console.log(`${new Date().toISOString()} - ${prefix} - ${text}`)
    }

    logRequest(err: any, method: string, url: string, statusCode: number, level: LogLevel) {
        let prefix = `${new Date().toISOString()} - ${this.color(level == "error" ? "red" : level == "warning" ? "yellow" : "blue", level.toUpperCase())} - ${method} ${url} (${statusCode})`

        // Log the message to the console
        switch (typeof err) {
            case "number":
                console.error(`${prefix} - ${this.statusToMessage(err)}`)
                break;
            case "object":
                console.error(`${prefix} - ${err.message}`)
                break;
            case "string":
            default:
                console.error(`${prefix} - ${err}`)
                break;
        }
    }

    middleware(err: any, req: Express.Request, res: Express.Response, next: Express.NextFunction, level: LogLevel[]) {
        let status: number = typeof err == "object" && err.status !== undefined ? err.status : typeof err == "number" ? err : 500
        res.status(status)

        if ((level.filter((v) => v == "error").length > 0 && status >= 500) || (level.filter((v) => v == "info").length > 0 && status < 500)) {
            this.logRequest(err, req.method, req.originalUrl, res.statusCode, status < 500 ? "info" : "error")
        }

        next(typeof err == "object" && !(err instanceof Error) ? err : { status: status, message: Statuses[status] })
    }
}

export function handleErrors(options: ErrorHandlingMiddlewareOptions) {
    let logLevel: LogLevel[] = options.logLevel ? options.logLevel : ["error", "warning", "info"]

    return (err: any, req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
        new ErrorHandlingMiddleware().middleware(err, req, res, next, logLevel)
    }
}

export function log(kind: LogLevel, text: string) {
    new ErrorHandlingMiddleware().log(kind, text)
}