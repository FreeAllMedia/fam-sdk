# Free All Media Javascript SDK

* This SDK helps you integrate FAM into your web site or web app with ease.
* Event callbacks for everything you need.
* Can be included into an HTML document or imported directly via `npm`.
* CDN hosted and non-hosted copies available.

## Installation

**CDN Hosted**

The latest version of the FAM Javascript SDK is hosted on our CDN at:

    https://cdn.freeallmedia.com/sdk/js/1/fam.js

**HTML**

```html
<!-- Include this at the bottom of your 'body' tag -->
<script src="https://cdn.freeallmedia.com/sdk/js/1/fam.js"></script>
<script type="text/javascript">
  (function (window) {
    const fam = new Fam();
  })(window);
</script>
```

**NPM**

You can install the FAM Javascript SDK from `npm`:

```shell
$ npm install fam-sdk --save
```

You can import FAM directly as a module via the `import` keyword:

```javascript
import Fam from "fam-sdk";

const fam = new Fam()
```

There is a `/dist/` directory for those that prefer directly including a local copy into their HTML documents:

```shell
$ npm install fam-sdk
$ ls ./node_modules/fam-sdk/dist/fam.js
```

## Usage

### `fam.window(url)`

1. Takes a FAM campaign URL
2. Displays the FAM campaign in a new window or tab.
3. Returns the new `window` object.

```javascript
const famWindow = fam.window("https://cdn.freeallmedia.com/my-campaign/index.html");

setTimeout(() => {
  famWindow.close();
}, 5000);
```

### `fam.iframe(domID, url)`

1. Takes a domID to an element on your HTML page and a FAM campaign URL.
2. Creates an iFrame within the designated element that displays the FAM campaign.
3. Returns the iFrame's DOM element.

```javascript
const iFrameElement = fam.iframe("https://cdn.freeallmedia.com/my-campaign/index.html");
```

### `fam.on(eventName, eventHandler)`

1. Takes an event name and event handler function.
2. Calls the event handler function each time
3. Returns the iFrame's DOM element.

```javascript
fam.on("start", function () {
  console.log("FAM experience started.");
});
```

```javascript
fam.on("end", function () {
  console.log("FAM experience ended.");
});
```

```javascript
fam.on("close", function (activity) {
  console.log(`FAM experience closed by user while on activity named "${activity.name}"`);
});
```

```javascript
fam.on("activity:start", function (activity) {
  console.log(`Activity named "${activity.name}" of type "${activity.type}" started.`);
});
```

```javascript
fam.on("activity:end", function (activity, results) {
  console.log(`Activity named "${activity.name}" of type "${activity.type}" ended with the following results:`, results);
});
```

```javascript
fam.on("creative:impression", function (activity, creative) {
  console.log(`Creative "${creative.name}" shown in activity "${activity.name}"`);
});
```

```javascript
fam.on("creative:clickthrough", function (activity, creative, url) {
  console.log(`Creative "${creative.name}" clicked through to url "${url}" in activity "${activity.name}"`);
});
```

```javascript
fam.on("creative:impression", function (activity, creative) {
  console.log(`Creative "${creative.name}" shown in activity "${activity.name}"`);
});
```

```javascript
fam.on("creative:clickthrough", function (activity, creative, url) {
  console.log(`Creative "${creative.name}" clicked through to url "${url}" in activity "${activity.name}"`);
});
```

```javascript
fam.on("video:play", function (activity) {
  console.log(`Video for activity "${activity.name}" playing.`);
});
```

```javascript
fam.on("video:pause", function (activity) {
  console.log(`Video for activity "${activity.name}" paused.`);
});
```

```javascript
fam.on("video:end", function (activity) {
  console.log(`Video for activity "${activity.name}" ended.`);
});
```

```javascript
fam.on("video:mute", function (activity) {
  console.log(`Video for activity "${activity.name}" muted.`);
});
```

```javascript
fam.on("video:unmute", function (activity) {
  console.log(`Video for activity "${activity.name}" un-muted.`);
});
```
