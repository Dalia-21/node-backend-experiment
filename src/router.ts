import * as api from "./api.js";

export function routeGetRequest(url: string) {
	console.log("Received:", url);
	if (getApis.hasOwnProperty(url)) {
		getApis[url]();
	} else if (getApis.hasOwnProperty('/' + url.split('/')[1])) {
		getApis['/' + url.split('/')[1]](url.split('/')[2]);
		/* 
		 * This is a hack which splits the first part of the url before
		 * the second slash and compares it to the api structure.
		 * It only supports one path variable in the second position.
		 * Proper path variable parsing would be needed to advance 
		 * beyond this point.
		 */
	} else {
		display_404(url);
	}
}

export function routePostRequest(url: string, data: string) {
	console.log("Received url:", url, "and data:", data);
	if (postApis.hasOwnProperty(url)) {
		postApis[url](data);
	} else if (postApis.hasOwnProperty('/' + url.split('/')[1])) {
		postApis['/' + url.split('/')[1]](data);
	} else {
		display_404(url);
	}
}

function display_404(url: string) {
	console.error("Url", url, "not found");
}

const getApis = {
	"/books": api.listBooks,
	"/patrons": api.listPatrons,
	"/book": api.getBook,
	"/patron": api.getPatron
}

const postApis = {
	"/books": api.createBook,
	"/patrons": api.createPatron,
	"/book": api.updateBook,
}

