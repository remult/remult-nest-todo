import { remultExpress } from 'remult/remult-express';
import { Task } from '../shared/Task';
import { TasksController } from '../shared/TasksController';
import { createPostgresConnection } from "remult/postgres";


export const api = remultExpress({
    dataProvider: async () => {
        if (process.env["NODE_ENV"] === "production")
            return createPostgresConnection({ configuration: "heroku" });
        return undefined;
    },
    entities: [Task, TasksController],
    
    rootPath: ''
});
