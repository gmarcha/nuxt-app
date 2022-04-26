# nuxt-app

A client application in Nodejs with Nuxtjs, a Vue framework.

[![ci](https://github.com/gmarcha/nuxt-app/actions/workflows/ci.yml/badge.svg)](https://github.com/gmarcha/nuxt-app/actions/workflows/ci.yml)

## Requirements

- Install [`nodejs`](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions) (shipped with `npm`) and [`yarn`](https://yarnpkg.com/getting-started/install).

## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For detailed explanation on how things work, check out the [documentation](https://nuxtjs.org).

## Special Directories

You can create the following extra directories, some of which have special behaviors. Only `pages` is required; you can delete them if you don't want to use their functionality.

### `assets`

The assets directory contains your uncompiled assets such as Stylus or Sass files, images, or fonts.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/assets).

### `components`

The components directory contains your Vue.js components. Components make up the different parts of your page and can be reused and imported into your pages, layouts and even other components.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/components).

### `layouts`

Layouts are a great help when you want to change the look and feel of your Nuxt app, whether you want to include a sidebar or have distinct layouts for mobile and desktop.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/layouts).

### `pages`

This directory contains your application views and routes. Nuxt will read all the `*.vue` files inside this directory and setup Vue Router automatically.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/get-started/routing).

### `plugins`

The plugins directory contains JavaScript plugins that you want to run before instantiating the root Vue.js Application. This is the place to add Vue plugins and to inject functions or constants. Every time you need to use `Vue.use()`, you should create a file in `plugins/` and add its path to plugins in `nuxt.config.js`.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/plugins).

### `static`

This directory contains your static files. Each file inside this directory is mapped to `/`.

Example: `/static/robots.txt` is mapped as `/robots.txt`.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/static).

### `store`

This directory contains your Vuex store files. Creating a file in this directory automatically activates Vuex.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/store).

## Tools

- **HTML** and **CSS**\
   `HTML` is a markup language allowing to structure web contents. `CSS` is a stylesheet language used to manage presentation of a document written in a markup language. These two languages are fundamentals and interdependents to build user-interfaces in a web environment.\
   _Links to mozilla HTML [documentation](https://developer.mozilla.org/en-US/docs/Web/HTML) and to mozilla CSS [documentation](https://developer.mozilla.org/en-US/docs/Web/CSS)._

- **JavaScript**\
   `JavaScript` is an interpreted (or just-in-time compiled) programming language used as a scripting language in a web browser. It implements closures, object-oriented programming based on prototypes and asynchronous programming based on promises.\
   _Link to mozilla [documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript). Additional link to a stackoverflow's post about [closures](https://stackoverflow.com/questions/111102/how-do-javascript-closures-work)._

- **TypeScript**\
   `TypeScript` is a superset of `JavaScript` adding static typing and intellisense support. It facilitates code debugging and avoids unexpected behaviors.\
   _Link to [documentation](https://www.typescriptlang.org/docs/)._

- **Node.js**\
   `Node.js` is an open-source and cross-plateform `JavaScript` runtime environment. It allows to run single-threaded `JavaScript` application in any environment.\
   _Links to [guide](https://nodejs.dev/learn) and [documentation](https://nodejs.org/en/docs/)._

- **npm** or/and **yarn**\
  `npm` and `yarn` are package managers used to manage node dependencies. It allows to install software or to manage an application dependencies in a `package.json` file.\
  _Links to [npm documentation](https://docs.npmjs.com/) and [yarn documentation](https://yarnpkg.com/getting-started)._

---

- **Vue.js** _(v2.x)_\
   `Vue.js` is a modern web-component `JavaScript` framework. It uses reusable block of code called `components` to build an user-interface application.\
   _Links to vue [documentation](https://v2.vuejs.org/v2/guide/), to vue-router [documentation](https://router.vuejs.org/guide/) and to vuex [documentation](https://vuex.vuejs.org/) (vue's global state management system, also known as a 'store')._

- **Vuetify** _(v2.x)_\
   `Vuetify` is a user-interface `Vue.js` framework offering ready to use Material Components (following `Material Design specification`). Components are customisables and responsives (adapting to different screen sizes).\
   _Link to [documentation](https://vuetifyjs.com/en/introduction/why-vuetify/)._

- **NuxtJS** _(v2.x)_\
   `NuxtJS` is a `Vue.js` framework. Basic functionnalities are directly built-in in the framework and available out-of-the-box (a vue-router or a vuex store for example). Package managers allow to easily setup a `NuxtJS` project (with `npm init nuxt-app <project-name>` or `yarn create nuxt-app <project-name>`).\
   _Links to [documentation](https://nuxtjs.org/docs/get-started/installation), to typescript module [documentation](https://typescript.nuxtjs.org/) and to axios module [documentation](https://axios.nuxtjs.org/)._

---

- **Axios**\
  Axios is a promise based HTTP client. It allows to perform HTTP requests either in a browser (using `XMLHttpRequest` internally) or in a `Node.js` environment (with `http` library).\
  _Links to axios [documentation](https://axios-http.com/docs/intro) and to nuxt/axios [documentation](https://axios.nuxtjs.org/)._

- **DayJS**\
   DayJS is a lightweight library used to format date and time.\
   _Links to [documentation](https://day.js.org/docs/en/installation/installation)._

---

- **Material Design**\
   `Material Design` is a design guideline made by `Google`. Its goal is to enforce consistency between different plateforms. `Material` also concernes component system and design tools.\
   _Link to [`Material Design`](https://material.io/design)._

- **Figma**\
   `Figma` is a vector graphics editor and prototyping tool. It allows to draw design models collaboratively.\
   _Link to [documentation](https://www.figma.com/)._

---

- **Unsplash**\
   `Unsplash` is an image datastock proposing tons of free photographies and images. They are protected by `Unsplash`'s in-house license, allowing non-commercial and commercial usages (except to create a competing business to `Unsplash`).\
   _Link to [`Unsplash`](https://unsplash.com/)._

## Author

[@gmarcha](https://github.com/gmarcha)

## License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
