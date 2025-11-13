import { type Book, type Patron } from "./types.js";
import * as bookService from "./book-service.js";
import * as patronService from "./patron-service.js";

export function listBooks(): Book[] {
	const books = bookService.listBooks();
	console.log("Found books:", books);
	return books;
}

export function getBook(title: string) {
	bookService.getBook(title).then((book) => {
		console.log("Book found:", book);
	});
}

export function createBook(data: string) {
	bookService.createBook(data);
}

export function listPatrons(): Patron[] {
	console.log("Patrons function called");
	return new Array();
}

export function createPatron(data: string) {
	patronService.createPatron(data);
}
