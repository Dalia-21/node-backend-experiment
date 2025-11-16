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
		if (book === null) {
			console.log("No book found with title:", title);
		} else {
			console.log("Found book", book);
		}
	});
}

export function createBook(data: string) { // Need to await
	bookService.createBook(JSON.parse(data));
	console.log("Book created");
}

export function updateBook(title: string, data: string) { // Need to await
	bookService.updateBook(title, JSON.parse(data))
		.catch((error: Error) => {
			console.error(error.message);
	});;
}

export function borrowBook(title: string, patronName: string) {
	patronService.borrowBook(title, patronName);
	bookService.borrowBook(title, patronName);
	console.log("Book", title, "loaned successfully");
}

export function returnBook(title: string) {
	patronService.returnBook(title);
	bookService.returnBook(title);
	console.log("Book", title, "returned successfully");
}

export function listPatrons() {
	patronService.listPatrons().then((patrons) => {
		for (const patron of patrons) {
			console.log(patron);
		}
	});
}

export function createPatron(data: string) {
	patronService.createPatron(JSON.parse(data));
}

export function getPatron(name: string) {
	patronService.getPatron(name).then((patron) => {
		if (patron === null) {
			console.log("No patron found with name:", patron);
		} else {
			console.log("Patron found:", patron);
		}
	});
}

export function updatePatron(name: string, data: string) {
	patronService.updatePatron(name, JSON.parse(data));
}

