# wasd2018

A bundle of broadcast graphics for 
[Warwick's Awesome Speedruns & Demos](https://uwcs.co.uk/events/wasd-2018) to
be used with [nodecg](https://nodecg.com).

## Currently in development

### Todo

* [ ] Now playing
  * [ ] Extension
  * [x] Replicant
  * [ ] Dashboard panel
* [x] Countdown
  * [x] Extension
  * [x] Replicant
  * [x] Dashboard panel
* [ ] Game overlays:
  * [ ] Add sponsor rotation
* [ ] Break screen overlay:
  * [ ] Add now playing to overlay space
  * [ ] Add countdown to overlay space

## Libraries

This bundle is built on the [nodecg](https://nodecg.com) broadcast graphics
framework, under the MIT license.

The dashboard uses [MithrilJS](https://mithril.js.org) for creating user
interface components, under the  MIT license.

The broadcast graphics use the [anime.js](http://animejs.com) JavaScript
animation engine for animating on screen elements, under the MIT license.

This bundle uses [livesplit-core](https://github.com/LiveSplit/livesplit-core)
timing library, under the MIT license.

## Installation

* Setup and install [Node.js](https://nodejs.org)
* Setup and install [nodecg](https://nodecg.com)
* Clone this repo and place into the `/bundles` directory of your `nodecg`
  installation
* Install dependencies by running `npm install` within the `wasd2018` directory
* Copy `wasd2018.json` to the `/cfg` directory of your `nodecg` installation
* Populate the `wasd2018.json` file with the correct credentials/settings
* Run using command `node index.js` in the directory of your `nodecg`
  installation
