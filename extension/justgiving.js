"use strict";

/* Nodecg context */
const nodecg = require("./util/nodecg-api-context").get();

/* Replicants */
const total = nodecg.Replicant("total");

/* Libraries */
const request = require("request-promise-native");
const util    = require("util");

// API environments
const SANDBOX = "https://api.sandbox.justgiving.com";
const LIVE    = "https://api.justgiving.com";

// API Endpoints to use
const PAGE_DETAILS   = "/%s/v1/fundraising/pages/%s";  // <= to fetch total
const PAGE_DONATIONS = "/%s/v1/fundraising/pages/%s/donations";

