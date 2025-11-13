#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { routeGetRequest, routePostRequest } from "./router.js";

const argv = yargs(hideBin(process.argv))
	.option('method', {
		alias: 'm',
		type: 'string',
		description: 'request method',
		demandOption: true
	})
	.option('url', {
		alias: 'u',
		type: 'string',
		description: 'request url',
		demandOption: true
	})
	.option('data', {
		alias: 'd',
		type: 'string',
		description: 'request body',
		demandOption: false
	})
	.parseSync();

if (argv.url && isValidUrl(argv.url)) {
	if (argv.method === 'get') {
		routeGetRequest(argv.url);
	} else if (argv.method === 'post') {
		routePostRequest(argv.url, argv.data);
	}
} else {
	console.error("Malformed URL provided:", argv.url);
}

function isValidUrl(url: string): boolean {
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

function isValidUrlChar(c: string): boolean {
	const charCode = c.charCodeAt(0);
	if ((charCode > 64 && charCode < 91) || // Uppercase letters
			(charCode > 96 && charCode < 123) || // Lowercase letters
			(charCode === 47)) { // '/' for URL separator
		return true;
	} else {
		return false;
	}
}

