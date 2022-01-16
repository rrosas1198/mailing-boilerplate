# Mailing Boilerplate

Flow for the creation of emails created with Gulp, SASS and Handlebars.

## Features

-   Ready for Email Template Development
-   The bundle exports the files ready to upload
-   Images are optimized and exported in the build folder
-   CSS styles are converted inline for each HTML tag

## Getting Started

```bash
git clone https://github.com/rrosas1198/mailing-boilerplate.git
cd mailing-boilerplate
npm install

# Run in development and serve at localhost:3000
npm run dev

# build for production
npm run build
```

## Architecture

In the src folder there are different folders, each having unique functionality and playing a role in the Gulp flow. For more information see: https://github.com/foundation/panini#readme

### `assets`

The assets directory contains your uncompiled assets, such as Sass files or images.

### `mailings`

The root of templates for emails. It is where templates must be created so that they can be compiled.

### `layouts`

Path to a folder containing layouts. Layout files can have the extension `.html`, `.hbs` or `.handlebars`. A layout must be named `default`.

### `partials`

Path to a folder containing HTML partials. Partial files can have the extension `.html`, `.hbs`, or `.handlebars`. Each will be registered as a partial Handlebars that can be accessed using the file name. (The path to the file doesn't matter, only the file name is used.)

### `pageLayouts`

A list of presets for page layouts, grouped by folder. This allows you to automatically set all pages within a certain folder to have the same layout.

### `helpers`

Path to a folder containing Handlebars helpers. Handlebars helpers are `.js` files which export a function via `module.exports`. The name used to register the helper is the same as the name of the file.
For example, a file named `markdown.js` that exports this function would add a Handlebars helper called `{{markdown}}`.

### `data`

Path to a folder containing external data, which will be passed in to every page. Data can be formatted as JSON (`.json`) or YAML (`.yml`). Within a template, the data is stored within a variable with the same name as the file it came from.
