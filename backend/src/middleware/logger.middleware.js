import pinoHttp from "pino-http";
import { logger } from "../utils/logger.js";
import { reqSerializer, resSerializer, errSerializer } from "../utils/logSerializer.js";

// Creates a middleware that automatically observes HTTP requests and responses cleanly
export const httpLogger = pinoHttp({
    logger,
    serializers: {
        req: reqSerializer,
        res: resSerializer,
        err: errSerializer,
    },
    customErrorMessage: (req, res, err) => {
        return `Request errored (${res.statusCode || 500}): ${err.message}`;
    },
    customSuccessMessage: (req, res, responseTime) => {
        return `Request completed in ${responseTime}ms (${res.statusCode})`;
    }
});