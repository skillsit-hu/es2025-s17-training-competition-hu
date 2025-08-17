# Modules Overview

**EuroSkills 2025 Training Competition**

Submitted by: [Skills IT](https://skillsit.hu)

You are a freelance web developer who places great importance on social responsibility, which is why you have volunteered to take on development tasks for **SkillShare Academy**.

In this training competition, you will be given **five** different tasks.

Descriptions of the tasks:

- [Module A - Static Website Design](module-a.md)
- [Module B - Dynamic Website with Server-Side Rendering](module-b.md)
- [Module C - REST API](module-c.md)
- [Module D - Interactive Frontend using an API](module-d.md)
- [Module E - Advanced Web Development](module-e.md)

## Technical Environment

You can solve the tasks by developing them on your own machine.

### Gitea, git

For all five tasks, you can start with a selected template repo available on Gitea.

The available template repos:

- react-app
- react-ts-app
- vue-app
- vue-ts-app
- node-app
- node-ts-app
- laravel-app
- vanilla-js-app

The Gitea service is available at the following address: [https://gitea.sudsy.com](https://gitea.sudsy.com)

To log in, you must use the username and password (a 4-digit PIN code) you have been given.
After logging in, create a new repo for the next task.

- In the Owner field, select `competitors` team! **Make sure you set this option carefully because if you set your own user as the owner, the automatic deployment will not work!**
- Give the name of the new repo using the following pattern: `module-X-Y`, where `X` is the module number, and `Y` is your workstation number. **Make sure you set the repo's name carefully because if you make a mistake, the automatic deployment will not work!** _(Example: module-a-1)_
- Under the template field, select the appropriate template (e.g. `react-ts-app`). Select `Git Content (Default Branch)` for `Template Items`.

Once the new repo is created, clone it to your own workstation inside the `d:\ws2026-s17-hu-r3` folder.

### Using npm modules

The npm modules will be accessible via a local npm cache. This means that even though there will be no internet access to the machines, you will be able to add the available npm modules to the projects as usual, and the `npm install` command issued on the cloned template projects will install all the npm modules needed for your project.

The available npm modules:

- express
- mysql
- mysql2
- vue-router
- react-router, react-router-dom
- axios
- sass
- prisma, @prisma/client
- express-validator
- zod
- tailwindcss
- postcss
- autoprefixer
- typescript
- _and all the types (@types/) needed for the TS projects_

### Laravel projects, composer install

The Laravel project contains all the necessary files, so you will not need to `composer install`. Your workstation has PHP 8 installed, so you can use the `php artisan` commands in the Laravel project.

### Deployment

When you commit and push your work, the deployment will start automatically. You can follow the process in the Gitea interface under the Action tab. Once the deployment is complete, your project will be available at `https://module-X-YYYY.sudsy.com`, where `X` is the module number and `YYYY` is your 4-digit PIN.

### Database access

You will have your own database on the MySQL database server (`db.sudsy.com`) available on the local network. You will need to use this database for development, and the same database will provide the data for your projects deployed to the server. A database dump will be provided to get the initial data. During the marking, the database will be restored to its original state using the same dump. Your backend solution also uses this database.
