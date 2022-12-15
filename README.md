# FlashUI (Nitro React client)

A modified UI for the Nitro React client from Billsonnn.
Installation process is the same as for setting up the normal client.

We recommend you to use the main-branch because thats the one that probably will be most stable.

Dev branch will be more updated but their will be risk for bugs, if you find any issues within the dev-branch please report them here on the Git.

If you ever see a branch with the name "bug-fixes" or something similar do not use it on your hotel because that is only a branch for developers, that branch is when we pull all the updates from original Nitro V2 and there might be issues that needs to be fixed first before its ready to use.

Please join our Discord so that you are always being up-to-date with info [here.](https://discord.gg/KGYG5V2vf3)
## Contribution

Thanks to everyone that has helped out contributing to this UI:
- Robbis
- Live
- Laynester
- Ørjan

## Nitro Client installation

Requirements:

-   [Git](https://git-scm.com/)
-   [NodeJS](https://nodejs.org/) >= 18
    - If using NodeJS < 18 remove `--openssl-legacy-provider` from the package.json scripts
-   [Yarn](https://yarnpkg.com/) `npm i yarn -g`

Installation:

-   First you should open terminal and navigate to the folder where you want to clone Nitro
-   Clone Nitro
    -   `git clone https://git.krews.org/nitro/nitro-react.git`
-   Install the dependencies
    -   `yarn install`
    -   This may take some time, please be patient
-   Rename a few files
    -   Rename `public/renderer-config.json.example` to `public/renderer-config.json`
    -   Rename `public/ui-config.json.example` to `public/ui-config.json`
-   Set your links
    -   Open `public/renderer-config.json`
        -   Update `socket.url, asset.url, image.library.url, & hof.furni.url`
    -   Open `public/ui-config.json`
        -   Update `camera.url, thumbnails.url, url.prefix, habbopages.url`
    -   You can override any variable by passing it to `NitroConfig` in the index.html

Usage:

-   To use Nitro you need `.nitro` assets generated, see [nitro-converter](https://git.krews.org/nitro/nitro-converter) for instructions
-   See [Morningstar Websockets](https://git.krews.org/nitro/ms-websockets) for instructions on configuring websockets on your server

Development mode:

Run Nitro in development mode when you are editing the files, this way you can see the changes in your browser instantly

```
yarn start
```

Build for production:

To build a production version of Nitro just run the following command

```
yarn build:prod
```

-   A `build` folder will be generated, these are the files that must be uploaded to your webserver
-   Consult your CMS documentation for compatibility with Nitro and how to add the production files
