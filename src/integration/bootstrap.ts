import "reflect-metadata";
import { Container, ContainerModule } from "inversify";
import { TYPES } from "../application/constants/types";
import { InversifyExpressServer } from "inversify-express-utils";
import * as express from "express";
import * as bodyParser from "body-parser";
import helmet from "helmet";
import { exceptionLoggerMiddleware } from "../infrastructure/middleware/logger-middleware";

import * as cors from "cors";

export async function bootstrap(container: Container, appPort: any, ...modules: ContainerModule[]) {
    console.log("[bootstrap] Starting ...");

    if (container.isBound(TYPES.App) == false) {
        container.load(...modules);

        const router = express.Router({
            caseSensitive: false,
            mergeParams: false,
            strict: false,
        });
        const server = new InversifyExpressServer(container, router);

        server.setConfig((app: any) => {
            app.set("etag", false);
            app.use(bodyParser.urlencoded({ extended: true }));
            app.use(bodyParser.json());
            app.use(helmet());

            //logger.info("[bootstrap]: Allow access to API (CORS allowing) ...");
            app.use(cors());
            app.options("*", cors());
        });

        server.setErrorConfig((app) => {
            app.use(exceptionLoggerMiddleware);
        });

        const app = server.build();
        console.log(`[bootstrap]: Application listening on port ${appPort}...`);
        app.listen(appPort);

        container.bind<express.Application>(TYPES.App).toConstantValue(app);
        return app;
    } else {
        return container.get<express.Application>(TYPES.App);
    }
}
