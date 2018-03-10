"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Statuses = require("statuses");
var ExpressErrorMiddleware = /** @class */ (function () {
    function ExpressErrorMiddleware() {
    }
    ExpressErrorMiddleware.prototype.color = function (color, text) {
        switch (color) {
            case "red":
                return "\u001B[31m" + text + "\u001B[0m";
            case "yellow":
                return "\u001B[33m" + text + "\u001B[0m";
            case "blue":
                return "\u001B[34m" + text + "\u001B[0m";
        }
    };
    ExpressErrorMiddleware.prototype.statusToMessage = function (number) {
        return Statuses[number] ? Statuses[number] : "Unknown status " + number;
    };
    ExpressErrorMiddleware.prototype.log = function (kind, text) {
        var prefix = kind == "error" ? this.color("red", "ERROR") : kind == "warning" ? this.color("yellow", "WARNING") : this.color("blue", "INFO");
        console.log(new Date().toISOString() + " - " + prefix + " - " + text);
    };
    ExpressErrorMiddleware.prototype.logRequest = function (err, method, url, statusCode, level) {
        var prefix = new Date().toISOString() + " - " + this.color(level == "error" ? "red" : level == "warning" ? "yellow" : "blue", level.toUpperCase()) + " - " + method + " " + url + " (" + statusCode + ")";
        // Log the message to the console
        switch (typeof err) {
            case "number":
                console.error(prefix + " - " + this.statusToMessage(err));
                break;
            case "object":
                console.error(prefix + " - " + err.message);
                break;
            case "string":
            default:
                console.error(prefix + " - " + err);
                break;
        }
    };
    ExpressErrorMiddleware.prototype.middleware = function (err, req, res, next, level) {
        var status = typeof err == "object" && err.status !== undefined ? err.status : typeof err == "number" ? err : 500;
        res.status(status);
        if ((level.filter(function (v) { return v == "error"; }).length > 0 && status >= 500) || (level.filter(function (v) { return v == "info"; }).length > 0 && status < 500)) {
            this.logRequest(err, req.method, req.originalUrl, res.statusCode, status < 500 ? "info" : "error");
        }
        next(typeof err == "object" && !(err instanceof Error) ? err : { status: status, message: Statuses[status] });
    };
    return ExpressErrorMiddleware;
}());
function errorHandlingMiddleware(options) {
    var logLevel = options.logLevel ? options.logLevel : ["error", "warning", "info"];
    return function (err, req, res, next) {
        new ExpressErrorMiddleware().middleware(err, req, res, next, logLevel);
    };
}
exports.errorHandlingMiddleware = errorHandlingMiddleware;
function log(kind, text) {
    new ExpressErrorMiddleware().log(kind, text);
}
exports.log = log;
