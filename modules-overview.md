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

- react
- vuejs
- vanillajs
- nextjs
- laravel

The Gitea service is available at the following address: [https://git.ssa.skillsit.hu](https://git.ssa.skillsit.hu)

To log in, you must use the username and password (a 4-digit PIN code) you have been given.
After logging in, create a new repo for the next task.

- Give the name of the new repo using the following pattern: `module-X`, where `X` is the module number. **Make sure you set the repo's name carefully because if you make a mistake, the automatic deployment will not work!** _(Example: module-a)_
- Under the template field, select the appropriate template (e.g. `react`). Select `Git Content (Default Branch)` for `Template Items`.

Once the new repo is created, clone it to your own workstation inside the `d:\es2025-training` folder.

Set Up Action Secrets:

- Go to Settings → Actions → Secrets in your new repository and add:

- USER: Your username (e.g., `comp01`)
- PASS: Your password (e.g., `test123`)

### Using npm modules

The npm modules will be accessible via a local npm cache. This means that even though there will be no internet access to the machines, you will be able to add the available npm modules to the projects as usual, and the `npm install` command issued on the cloned template projects will install all the npm modules needed for your project.

The available npm modules:

VueJS 3.5.13

- vue-router
- vue-axios
- pinia
- sass-loader
- node-sass
- eslint
- prettier
- vite
- tailwindcss
- bootstrap

ReactJS 19.1.0

- react-router-dom
- axios
- reduxjs/toolkit
- react-icons
- react-dom
- react-redux
- tailwindcss/vite
- tanstack/react-query
- tanstack/react-query-devtools
- react-hook-form
- framer-motion
- zod
- react-helmet
- date-fns
- jest
- tailwind-merge
- react-toast
- laravel-echo
- pusher-js
- react-table
- socket.io-client

### Laravel projects, composer install

The Laravel project contains all the necessary files, so you will not need to `composer install`. Your workstation has PHP 8 installed, so you can use the `php artisan` commands in the Laravel project.

### Deployment

When you commit and push your work, the deployment will start automatically. You can follow the process in the Gitea interface under the Action tab. Once the deployment is complete, your project will be available at `https://XXX-module-Y.ssa.skillsit.hu`, where `Y` is the module number and `XXX` is your username.

### Database access

You will have your own database on the MySQL database server (`db.ssa.skillsit.hu`) available on the network. You will need to use this database for development, and the same database will provide the data for your projects deployed to the server.
