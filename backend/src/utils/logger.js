import pino from "pino";
import crypto from "crypto";
import { reqSerializer, resSerializer, errSerializer } from "./logSerializer.js";

const isNotProduction = process.env.NODE_ENV !== "production";

export const logger = pino({
    level: process.env.LOG_LEVEL || "info",
    redact: ['password', 'headers.authorization', 'token', 'user.password'],
    serializers: {
        req: reqSerializer,
        res: resSerializer,
        err: errSerializer,
    },
    transport: isNotProduction ? {
        target: 'pino-pretty',
        options: {
            colorize: true,
            singleLine: false,
            levelFirst: true,
            translateTime: 'SYS:dd-mm-yyyy HH:MM:ss'
        }
    } : undefined,
    genReqId: (req) => {
        return req.headers["x-request-id"] || crypto.randomUUID();
    }
});

