# Safe Water

Set of public dashboards for dispensers for safe water project to provide insight into its KPI's.
The structure and build of our dashboards are aimed at different stakeholders of the project, including a donor base that is part of the effective altruism movement and seeks to understand the data behind the program.

## Development environment
To set up the development environment for this website, you'll need to install the following on your system:

- Node (v4.2.x) & Npm ([nvm](https://github.com/creationix/nvm) usage is advised)

> The versions mentioned are the ones used during development. It could work with newer ones.
  Run `nvm use` to activate the correct version.

After these basic requirements are met, run the following commands in the website's folder:
```
$ npm install
```

### Server (TEMPORARY)
This app requires communication with a server which can be found in the [THE] repo.
After running a local copy add the address to `config/local.js`:
```
  api: 'hppt://localhost:[port]'
```

> TEMPORARY: Once the server is deployed to a staging server this will be removed.

### Getting started

```
$ npm run serve
```
or
```
$ gulp serve
```
Compiles the sass files, javascript, and launches the server making the site available at `http://localhost:3000/`
The system will watch files and execute tasks whenever one of them changes.
The site will automatically refresh since it is bundled with livereload.

### Other commands
Compile the sass files, javascript... Use this instead of ```gulp serve``` if you don't want to watch.
```
$ npm run build
```
or
```
$ gulp
```