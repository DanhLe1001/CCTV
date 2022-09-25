import "reflect-metadata";

import * as dotenv from "dotenv";

// read the .env
dotenv.config();

import { bootstrap } from "./integration/bootstrap";
import { container } from "./integration/ioc-container";
import { referenceDataIoCModule } from "./integration/modules-registration";

async function runApp() {
    const app = await bootstrap(container, process.env.PORT, referenceDataIoCModule);
    return app;
}

(async () => {
    await runApp();
})();

export { runApp };
