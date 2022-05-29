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
    initApi: async remult => {
        const taskRepo = remult.repo(Task);
        if (await taskRepo.count() === 0) {
            await taskRepo.insert([
                { title: "Task a" },
                { title: "Task b", completed: true },
                { title: "Task c" },
                { title: "Task d" },
                { title: "Task e", completed: true }
            ]);
        }
    },
    rootPath: ''
});
