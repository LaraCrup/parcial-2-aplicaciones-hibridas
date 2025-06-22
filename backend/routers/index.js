import platosRouter from './platosRouter.js';
import ingredientesRouter from './ingredientesRouter.js';
import usersRouter from './usersRouter.js';

function routerAPI(app) {
    app.use("/api/platos", platosRouter);
    app.use("/api/ingredientes", ingredientesRouter);
    app.use("/api/users", usersRouter);
}

export default routerAPI;