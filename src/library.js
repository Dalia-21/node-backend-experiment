#!/usr/bin/env node
import yargs from 'yargs';
import { route } from "./router.js";
const argv = yargs(process.argv)
    .option('url', {
    alias: 'u',
    type: 'string',
    description: 'request url'
})
    .parseSync();
if (urlIsWellformed(argv.url)) {
    // Execute call to router
    route(argv.url);
}
else {
    console.error(`Malformed url provided: ${argv.url}`);
}
function urlIsWellformed(url) {
    if (!url || url.charAt(0) !== '/') {
        return false;
    }
    for (let c of url) {
        if (!isValidUrlChar(c)) {
            return false;
        }
    }
    return true;
}
function isValidUrlChar(c) {
    const charCode = c.charCodeAt(0);
    if ((charCode > 64 && charCode < 91) || // Uppercase letters
        (charCode > 96 && charCode < 123) || // Lowercase letters
        (charCode === 47)) { // '/' for URL separator
        return true;
    }
    else {
        return false;
    }
}
