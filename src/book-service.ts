import { type Book } from "./types.js";
import { BookRepository } from "./book-repository.js";

const bookRepository: BookRepository = new BookRepository();

export function listBooks(): Book[] {
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
