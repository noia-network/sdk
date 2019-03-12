# NOIA Network SDK Web Library (SDK WL)

## Building SDK WL

1.  Clone this repository.

```sh
git clone https://github.com/noia-network/sdk.git
```

2.  Open `./packages/sdk` directory

```sh
$ cd packages/sdk
```

3. Install SDK dependencies

```sh
$ npm install
```

4.  Build SDK library

```sh
$ npm run build
```

5. Open `./packages/sdk-web-lib` directory

6. Install SDK WL dependencies

```sh
$ npm install
```

7. Specifi public path in `webpack.config.js` if not base (`./`):

```js
const config = webpack.generateWebpackConfig({
    ...
    publicPath: "./relative/public/path/"
});
```

8.  Build SDK WL library

```sh
$ npm run build
```

9.  Use library (`packages/sdk-web-lib/dist`)

## Minimal `index.html` demo how SDK WL can be used

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta content="ie=edge" http-equiv="x-ua-compatible" />
        <base href="/" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Webpack App</title>
    </head>
    <body>
        <div id="root"></div>
        <script src="vendors~main.bundle.js" type="text/javascript"></script>
        <script src="main.bundle.js" type="text/javascript"></script>
        <img data-src="https://noia.network/wp-content/uploads/2018/03/icon.jpg" />
    </body>
    <script>
        const ready = fn => {
            if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
                fn();
            } else {
                document.addEventListener("DOMContentLoaded", fn);
            }
        };

        // Custom master url (optional).
        // window.NOIA.settings.masterUrl = "wss://csl-masters.noia.network:5566";

        // Enable/disable logging (optional).
        // window.NOIA.settings.log = true;

        // Initialize NOIA client.
        window.NOIA.init();

        ready(() => {
            // Execute content loader.
            window.NOIA.load();
        });
    </script>
</html>
```
