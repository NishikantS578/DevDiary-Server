# DevDiary-Server

## Setup instructions
- Install Dependencies
    ```
    npm i
    ```

- Create .env file in root of project and Setup environment variables according to .sample.env file

- Run Locally
    ```
    node index.js
    ```

## Deployment process

- Create Azure Account.

- Create Resource Group for Backend Server.

- Create Node API App resource and CosmosDB resource. 

- From Deployment Center add Github.  Repository for Continuous Deployment.

- Add Connection String of CosmosDB in API server Environment variable.
