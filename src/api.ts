import { type Book, type Patron } from "./types.js";
import * as bookService from "./book-service.js";
import * as patronService from "./patron-service.js";

export function listBooks() {
	bookService.listBooks().then((books) => {
		for (const book of books) {
			console.log(book);
		}
	});
}

export function getBook(title: string) {
	bookService.getBook(title).then((book) => {
		console.log("Book found:", book);
	});
}

export function createBook(data: string) {
	bookService.createBook(data);
}

export function listPatrons() {
	patronService.listPatrons().then((patrons) => {
		for (const patron of patrons) {
			console.log(patron);
		}
	});
}

export function createPatron(data: string) {
	patronService.createPatron(data);
}

export function getPatron(name: string) {
	patronService.getPatron(name).then((patron) => {
		console.log("Patron found:", patron);
	});
}

