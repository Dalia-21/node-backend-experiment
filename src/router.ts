import * as api from "./api.js";

export function routeGetRequest(url: string) {
	const basePath: string = url.split('/')[1];
	const pathVariables: string[] = getPathVariables(url);
	if (basePath === "books") {
		api.listBooks();
	} else if (basePath === "book") {
		api.getBook(pathVariables[0]);
	} else if (basePath === "patrons") {
		api.listPatrons();
	} else if (basePath === "patron") {
		api.getPatron(pathVariables[0]);
	} else {
		display_404(url);
	}
}

export function routePostRequest(url: string, data: string) {
	const basePath: string = url.split('/')[1];
	const pathVariables: string[] = getPathVariables(url);
	if (basePath === "books") {
		api.createBook(data);
	} else if (basePath === "book") { // These cases need error checking for url length too
		api.updateBook(pathVariables[0], data);		
	} else if (basePath === "patrons") {
		api.createPatron(data);
	} else if (basePath === "patron") {
		api.updatePatron(pathVariables[0], data);
	} else if (basePath === "borrow") {
		if (pathVariables.length !== 3) {
			throw new Error("Borrow path is /borrow/{title}/patron/{name}");
		}
		api.borrowBook(pathVariables[0], pathVariables[2]);
	} else if (basePath === "return") {
		api.returnBook(pathVariables[0]);
	} else {
		display_404(url);
	}
}

function getPathVariables(url: string): string[] {
	let tmp: string[] = url.split('/');
	if (tmp.length > 2) { // "/books".split('/') will have length 2
		return tmp.slice(2);
	} else {
		return new Array();
	}
}

function display_404(url: string) {
	console.error("Url", url, "not found");
}

