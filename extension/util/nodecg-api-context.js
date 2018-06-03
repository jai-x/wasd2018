"use strict";

// Module to store a reference of the `nodecg` api context for use in other
// extension modules

let context;
const get = () => context;
const set = (ctx) => context = ctx;
module.exports = { get, set };
