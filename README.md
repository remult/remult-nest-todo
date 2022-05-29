# remult nest todo
A todo app demo using `nest`, `react` and `remult`.

See live on [stackblitz](https://stackblitz.com/edit/remult-nest-todo?file=README.md)


The `nest` project structure is based on [nest's Authentication article](https://docs.nestjs.com/security/authentication) which was cloned from [github](https://github.com/nestjs/nest/tree/master/sample/19-auth-jwt)



## Run the project
```sh
npm run dev
```


## Nest integration explained 
The nest integration was implemented in two aspects
1. Remult full CRUD functionality - implemented as a `nest` `middleware`.
   1. [remult.middleware.ts](./src/remult.middleware/remult.middleware.ts)
   2. middleware registration at: [app.module.ts](./src/app.module.ts)
2. Remult as a `nest` `service`, to be used throughout nest controllers, for example [app.controller](./src/app.controller.ts#L26)