# FlashUI (Nitro React Client)

FlashUI is a customized user interface for the Nitro React client developed by Billsonnn. The installation process is the same as setting up the regular client.

We recommend using the main branch as it provides the most stable version.

The dev branch receives frequent updates, but it carries a higher risk of encountering bugs. If you come across any issues within the dev branch, please report them on the Git repository.

If you encounter a branch named "bug-fixes" or something similar, please avoid using it on your hotel. It is a branch intended for developers, where updates from the original Nitro V2 are merged. There may be unresolved issues that need to be addressed before it is ready for use.

Stay up-to-date with the latest information by joining our Discord community [here](https://discord.gg/KGYG5V2vf3).

## Contribution

Feel free to contribute and help make this UI resemble Flash as closely as possible. We appreciate collaboration from the community in enhancing this UI.

Special thanks to the following individuals who have contributed to this UI:
- Robbis
- Live
- Laynester
- Dennis
- Object
- Gizmo
- Tardelivinicius

# Nitro Client Installation

Prerequisites:
- Git
- NodeJS >= 18
  - If you are using NodeJS < 18, remove the `--openssl-legacy-provider` flag from the package.json scripts.
- Yarn (install globally using `npm i yarn -g`)

Installation:

1. Open the terminal and navigate to the desired folder where you want to clone Nitro.
2. Run the following command to clone Nitro:
   ```
   git clone https://github.com/robbis95/nitro-react-flashUI.git
   ```
3. Install the dependencies by executing:
   ```
   yarn install
   ```
   Please be patient as this process may take some time.
4. Rename the following files:
   - Rename `public/renderer-config.json.example` to `public/renderer-config.json`.
   - Rename `public/ui-config.json.example` to `public/ui-config.json`.
5. Set your links:
   - Open `public/renderer-config.json` and update the following: `socket.url`, `asset.url`, `image.library.url`, and `hof.furni.url`.
   - Open `public/ui-config.json` and update the following: `camera.url`, `thumbnails.url`, `url.prefix`, and `habbopages.url`.
   - You can override any variable by passing it to `NitroConfig` in the `index.html` file.

Usage:

- To use Nitro, you need to generate `.nitro` assets. Please refer to the instructions provided in the nitro-converter repository for detailed steps.
- For instructions on configuring websockets on your server, please consult the Morningstar Websockets documentation.

Development:

When editing the files, run Nitro in development mode to instantly see the changes in your browser:
```
yarn start
```

Production:

To build a production version of Nitro, use the following command:
```
yarn build:prod
```

This will generate a `dist` folder containing the files that should be uploaded to your web server. Please refer to your CMS documentation for information on compatibility with Nitro and instructions on adding the production files.
