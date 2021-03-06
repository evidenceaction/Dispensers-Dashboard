# Dispensers Dashboard
Set of public dashboards for the [Dispensers for Safe Water](http://www.evidenceaction.org/dispensersforsafewater) project to provide insight into its KPI's. The data for these dashboards is provided by the [Dispensers Dashboard API](https://github.com/evidenceaction/Dispensers-Dashboard-API).


## Development environment
To set up the development environment for this website, you'll need to install the following on your system:

- Node (v4.2.x) & Npm ([nvm](https://github.com/creationix/nvm) usage is advised)

> The versions mentioned are the ones used during development. It could work with newer ones.
  Run `nvm use` to activate the correct version.

After these basic requirements are met, run the following commands in the website's folder:
```
$ npm install
```

### API
When you run this project locally, it will connect to the production API by default. Alternatively, you can run a local copy of the [Dispensers Dashboard API](https://github.com/evidenceaction/Dispensers-Dashboard-API).

In that case, you will have to add its address to `config/local.js`:
```
  api: 'http://localhost:[port]'
```

### Getting started

```
$ npm run serve
```
Compiles the sass files, javascript, and launches the server making the site available at `http://localhost:3000/`
The system will watch files and execute tasks whenever one of them changes.
The site will automatically refresh since it is bundled with livereload.

### Other commands
Compile the sass files, javascript... Use this instead of ```npm run serve``` if you don't want to watch.
```
$ npm run build
```


