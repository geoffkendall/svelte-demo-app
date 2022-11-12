# SvelteKit Demo App
## Using Prisma and Postgres

The SvelteKit Demo app, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte), and updated to use [Prisma](https://www.prisma.io/) and [Postgres](https://www.postgresql.org/).  ~~Hosted on [Heroku](https://www.heroku.com): https://svelte-blog-demo-app.herokuapp.com/todos~~ Since [Heroku eliminated free plans](https://help.heroku.com/RSBRUH58/removal-of-heroku-free-product-plans-faq), the app is now hosted on [Railway](https://railway.app/): https://web-production-87f5.up.railway.app/todos.

## Heroku to Railway migration
Migrating the app from Heroku to [Railway](https://railway.app/) was super easy.  They have a [blog post](https://blog.railway.app/p/railway-heroku-rails) that walks you through it.  The post is based on migrating a Rails app, but the steps were fairly similar -- deploy the repo from GitHub, import your environment vairables, and add a new Postgres service.  Add, then remove, a new environment variable after adding the Postgres service, which will trigger a deploy.  Test the URL and you should be in business!

## Developing

Aside from your normal dev dependencies (`npm`, `git`, `homebrew`):

- Install [Docker](https://www.docker.com/)
- Check out this repo and run `npm ci`

Once you've installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```
You can preview the production build with `npm run preview`.
