const setDefaults = Symbol();
const listenForEvents = Symbol();
const detectAdblocker = Symbol();
const showDialog = Symbol();
const closeDialog = Symbol();
const showAdblockerDialog = Symbol();
const campaignURL = Symbol();

export default class FreeAllMedia {
  constructor(options) {
    this[setDefaults](options);
    this[listenForEvents]();
  }

  iframe(domID, campaignName) {
    if (!this[detectAdblocker]()) {
      const container = window.document.getElementById(domID);

      if (container) {
        const iframeElement = window.document.createElement("iframe");
        iframeElement.frameBorder = 0;
        iframeElement.setAttribute("src", this[campaignURL](campaignName));
        container.appendChild(iframeElement);
        this.on("end", () => {
          iframeElement.className = "closed";
        });
        return iframeElement;
      } else {
        throw new Error(`FAM: "${domID}" is not a valid DOM element ID.`);
      }
    } else {
      this[showAdblockerDialog]();
      return false;
    }
  }

  dialog(campaignName) {
    if (!this[detectAdblocker]()) {
      const dialog = this[showDialog]();
      dialog.className = "freeallmedia-dialog campaign";
      this.iframe(dialog.id, campaignName);
      this.on("end", () => {
        const shadeElement = window.document.getElementById("freeallmedia-shade");
        if (shadeElement) {
          shadeElement.click();
        }
      });
      return dialog;
    } else {
      this[showAdblockerDialog]();
      return false;
    }
  }

  window(campaignName) {
    if (!this[detectAdblocker]()) {
      const url = this[campaignURL](campaignName);
      return window.open(url);
    } else {
      this[showAdblockerDialog]();
      return false;
    }
  }

  on(eventName, eventHandler) {
    let handlerWrapper = function () { eventHandler(); };

    switch (eventName) {
      case "start":
      case "end":
      break;
      case "close":
      case "video:play":
      case "video:pause":
      case "video:end":
      case "video:mute":
      case "video:unmute":
      case "activity:start":
        handlerWrapper = function (event) {
          const activity = event.detail.activity;
          eventHandler(activity);
        };
      break;
      case "activity:end":
        handlerWrapper = function (event) {
          const activity = event.detail.activity;
          const results = event.detail.results;
          eventHandler(activity, results);
        };
      break;
      case "image:impression":
      case "image:clickthrough":
        handlerWrapper = function (event) {
          const activity = event.detail.activity;
          const creative = event.detail.creative;
          eventHandler(activity, creative);
        };
      break;
      default:
        throw new Error(`FAM: "${eventName}" is not a valid FAM event name. See README for full list of event names.`);
    }

    window.document.addEventListener(`fam:${eventName}`, handlerWrapper);
  }

  [setDefaults](options) {
    this.adblocker = {
      active: true,
      header: "Hello!",
      subheader: "The content you requested is ad-supported",
      body: "You'll need to temporarily disable your adblocker to access it."
    };
    this.environment = options.environment || "production";
    this.host = options.host || "https://cdn.freeallmedia.com/campaigns";
  }

  [campaignURL](campaignName) {
    return `${this.host}/${campaignName}/index.html`;
  }

  [listenForEvents]() {
    const eventListenerName = window.addEventListener ? "addEventListener" : "attachEvent";
    const eventListener = window[eventListenerName];
    const eventName = eventListenerName === "attachEvent" ? "onmessage" : "message";

    eventListener(eventName, event => {
      if (event.data.origin && event.data.origin === "FreeAllMedia") {
        const customEvent = new CustomEvent(event.data.event, { detail: event.data.payload });
        document.dispatchEvent(customEvent);
      }
    }, false);
  }

  [detectAdblocker]() {
    /* Adapted from npm package just-detect-adblock */
    if (this.adblocker.active) {
      var bait = document.createElement("div");
      bait.setAttribute("class", "pub_300x250 pub_300x250m pub_728x90 text-ad textAd text_ad text_ads text-ads text-ad-links freeallmedia");
      bait.setAttribute("style", "width: 1px ! important; height: 1px !important; position: absolute !important; left: -10000px !important; top: -1000px !important;");
      window.document.body.appendChild(bait);

      let adblockerDetected = window.document.body.getAttribute("abp") !== null ||
        bait.offsetParent === null ||
        bait.offsetHeight === 0 ||
        bait.offsetLeft === 0 ||
        bait.offsetTop === 0 ||
        bait.offsetWidth === 0 ||
        bait.clientHeight === 0 ||
        bait.clientWidth === 0;

      if (window.getComputedStyle !== undefined) {
        var baitTemp = window.getComputedStyle(bait, null);
        if (baitTemp && (baitTemp.getPropertyValue("display") === "none" || baitTemp.getPropertyValue("visibility") === "hidden")) {
          adblockerDetected = true;
        }
      }

      window.document.body.removeChild(bait);

      return adblockerDetected;
    } else {
      return false;
    }
  }

  [showAdblockerDialog]() {
    const dialogElement = this[showDialog]();

    const header = window.document.createElement("h1");
    const subheader = window.document.createElement("h2");
    const body = window.document.createElement("p");
    const howto = window.document.createElement("img");

    header.innerText = this.adblocker.header;
    subheader.innerText = this.adblocker.subheader;
    body.innerText = this.adblocker.body;

    dialogElement.appendChild(header);
    dialogElement.appendChild(subheader);
    dialogElement.appendChild(body);
    dialogElement.appendChild(howto);

    dialogElement.onclick = this[closeDialog];

    howto.setAttribute("src", "https://cdn.freeallmedia.com/adblocker-instructions/disable-adblocker.gif");
  }

  [showDialog]() {
    const bodyElement = window.document.body;

    const shadeElement = window.document.createElement("div");
    shadeElement.className = "freeallmedia-shade";
    shadeElement.id = "freeallmedia-shade";

    const dialogElement = window.document.createElement("div");
    dialogElement.className = "freeallmedia-dialog";
    dialogElement.id = "freeallmedia-dialog";

    shadeElement.appendChild(dialogElement);
    bodyElement.appendChild(shadeElement);

    window.onclick = (event) => {
      // console.log(event.target.tagName);
      if (event.target !== dialogElement && event.target.tagName !== "A") {
        // console.log(event.target);
        // console.log(dialogElement);
        this[closeDialog]();
      }
    };

    return dialogElement;
  }

  [closeDialog]() {
    const shadeElement = window.document.getElementById("freeallmedia-shade");
    const dialogClassName = "freeallmedia-shade closing";
    if (shadeElement.className !== dialogClassName) {
      shadeElement.className = dialogClassName;
      setTimeout(() => {
        window.document.body.removeChild(shadeElement);
      }, 500);
    }
  }
}
