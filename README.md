# Four Sons Stack

Everything you need to get started with a Four Sons project.

## Creating a project

You can use the 4sons/foursons-stack repository as a starting point. It is setup as a template repository, so you can use it to create a new repo in GitHub.

## Developing

1. First clone your repo and install dependencies with `npm install`.
2. Create a `.env.local` file in the root of your project with the contents of `.env.example`.
    - You will need to get the correct values from Kinde. Ask Colin or Adam.
3. Create your own database for the project using `wrangler`.
    - `npx wrangler d1 create <database_name>`
    - It will generate a snippet of config that you can replace the sample with in `wrangler.toml`.
4. Update `wrangler.toml` with the correct values for your project.

Once that is done, start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

The app should be accessible at http://localhost:5173.

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## Deploying

You will need to setup the application in Kinde.

Done via Cloudflare Workers Build. Details TBD.
