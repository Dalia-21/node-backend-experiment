import { type Book } from "./types.js";
import { BookRepository } from "./book-repository.js";

const bookRepository: BookRepository = new BookRepository();

export function listBooks(): Promise<Book[]> {
	return bookRepository.findAll();
}

export function getBook(title: string): Promise<Book> {
	return bookRepository.findByTitle(title);
}

export function createBook(data: string) {
	const book: Book = JSON.parse(data);
	if (book.title === undefined ||
			book.author === undefined ||
			book.publicationDate === undefined) {
		throw new Error("Title, author and publication date required to create new entry. Some fields were missing: " + JSON.stringify(book));
	}
	book.borrowed = false;
	book.dueDate = new Date();
	bookRepository.save(book);
}

export function updateBook(data: string) {
	const book: Book = JSON.parse(data);
	if (book.title === undefined || // "primary key" must be defined to locate record
			(book.author === undefined &&
			book.publicationDate === undefined)) { // at least one of these must be defined for update
		console.error("Insufficient data for update:", book);
	}
	bookRepository.findByTitle(book.title).then((existingRecord) => {
		if (existingRecord.author === book.author &&
				existingRecord.publicationDate === book.publicationDate) {
			console.error("Record is already up to date");
		}
		let modified: boolean = false;
		if (book.author !== undefined && book.author !== existingRecord.author) {
			existingRecord.author = book.author;
			modified = true;
		}
		if (book.publicationDate !== undefined && book.publicationDate !== existingRecord.publicationDate) {
			existingRecord.publicationDate = book.publicationDate;
			modified = true;
		}
		if (!modified) {
			console.error("Record is already up to date or insufficient data for update");
		} else {
			bookRepository.update(existingRecord);
		}
	});
}

