## FlashUI (Nitro React Client)

FlashUI is a customized user interface (UI) for the Nitro React client developed by Billsonnn. The installation process is the same as setting up the regular client.

For optimal stability, we recommend using the main branch. The dev branch is more frequently updated but may contain bugs. If you encounter any issues within the dev branch, please report them on the Git repository.

Please join our Discord community to stay up-to-date with the latest information by clicking [here](https://discord.gg/KGYG5V2vf3).

## Contribution

We invite you to contribute and help us make this UI as close to replicating Flash as possible. It would be fantastic to have the community's assistance in creating an exceptional UI!

Special thanks to the following contributors for their valuable contributions to this UI:

- Robbis
- Live
- Laynester
- Dennis
- Object
- Habbobba
- Tardelivinicius

Your dedication and expertise have played a crucial role in shaping this project. Thank you for your outstanding efforts and commitment to making FlashUI remarkable!

## Nitro Client Installation

Prerequisites:
- [Git](https://git-scm.com/)
- [NodeJS](https://nodejs.org/) version 18 or higher
  - If using NodeJS version less than 18, please remove `--openssl-legacy-provider` from the package.json scripts
- [Yarn](https://yarnpkg.com/) (install globally using `npm i yarn -g`)

Installation:

1. Open your terminal and navigate to the desired folder where you want to clone Nitro.
2. Clone Nitro by running the following command:
   ```
   git clone https://github.com/robbis95/nitro-react-flashUI.git
   ```
3. Install the required dependencies by running:
   ```
   yarn install
   ```
   This process may take some time, so please be patient.
4. Rename the following files:
   - Rename `public/renderer-config.json.example` to `public/renderer-config.json`
   - Rename `public/ui-config.json.example` to `public/ui-config.json`
5. Set your links:
   - Open `public/renderer-config.json` and update the values for `socket.url`, `asset.url`, `image.library.url`, and `hof.furni.url`.
   - Open `public/ui-config.json` and update the values for `camera.url`, `thumbnails.url`, `url.prefix`, and `habbopages.url`.
   - You can override any variable by passing it to `NitroConfig` in the `index.html` file.

Usage:

- To utilize Nitro, you need to generate `.nitro` assets. Refer to the [nitro-converter](https://git.krews.org/nitro/nitro-converter) for instructions on generating these assets.
- For instructions on configuring websockets on your server, see [Morningstar Websockets](https://git.krews.org/nitro/ms-websockets).

Development:

While editing the files, run Nitro in development mode to instantly see the changes in your browser. Execute the following command:
```
yarn start
```

Production:

To build a production-ready version of Nitro, execute the following command:
```
yarn build:prod
```

- This will generate a `dist` folder containing the necessary files that should be uploaded to your web server.
- Consult your CMS documentation to ensure compatibility with Nitro and for instructions on adding the production files.
