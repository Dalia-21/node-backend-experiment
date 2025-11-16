import { type Book, type Patron } from "./types.js";
import { BookRepository } from "./book-repository.js";

const bookRepository: BookRepository = new BookRepository();

export function listBooks(): Promise<Book[]> {
	return bookRepository.findAll();
}

export function getBook(title: string): Promise<Book> {
	return bookRepository.findByTitle(title);
}

export function createBook(book: Book) {
	if (book.title === undefined ||
			book.author === undefined ||
			book.publicationDate === undefined) {
		throw new Error("Title, author and publication date required to create new entry. Some fields were missing: " + JSON.stringify(book));
	}
	book.borrowed = false;
	book.dueDate = new Date();
	bookRepository.save(book);
}

// To disable updating metadata on books while on loan
// would require checking if the book is on loan, if it is 
// being returned in this update, and if the update includes
// a change to the title, since that's the data that is 
// stored on the patron.

export async function updateBook(title: string, book: Book): Promise<void> { // return Promise<Void> then await
	// The following checks are stupidly verbose but JavaScript's lazy approach to typing
	// has me paranoid!
	if (book.title === undefined &&
			book.author === undefined &&
			book.publicationDate === undefined &&
			book.borrower === undefined &&
			book.borrowed === undefined &&
			book.dueDate === undefined) {
		throw new Error("Insufficient data for update");
	}
	if (book.borrower !== undefined ||
			book.borrowed !== undefined ||
			book.dueDate !== undefined) {
		if (!(book.borrower !== undefined &&
					book.borrowed !== undefined &&
					book.dueDate !== undefined)) {
			throw new Error("Borrower, borrowed status and due date must all be updated for a loan");
		}
	}
	
	const existingRecord: Book = await bookRepository.findByTitle(title);
	let modified: boolean = false;
	if (book.author !== undefined && book.author !== existingRecord.author) {
		existingRecord.author = book.author;
		modified = true;
	}
	if (book.publicationDate !== undefined && book.publicationDate !== existingRecord.publicationDate) {
		existingRecord.publicationDate = book.publicationDate;
		modified = true;
	}
	if (book.borrowed !== undefined && book.borrowed !== existingRecord.borrowed) {
		existingRecord.borrowed = book.borrowed;
		modified = true;
	}
	if (book.dueDate !== undefined && book.dueDate !== existingRecord.dueDate) {
		existingRecord.dueDate = book.dueDate;
		modified = true;
	}
	if (book.borrower !== undefined && book.borrower !== existingRecord.borrower) {
		existingRecord.borrower = book.borrower;
		modified = true;
	}
	if (!modified) {
		throw new Error("Record is already up to date or insufficient data for update");
	} else {
		return bookRepository.update(existingRecord);
	}
}

export async function borrowBook(title: string, patronName: string) {
	const book: Book = await getBook(title);
	if (book.borrowed === true) {
		throw new Error("Book " + title + " is already on loan");
	}
	book.borrowed = true;
	book.borrower = patronName;
	book.dueDate = new Date();
	book.dueDate.setDate(book.dueDate.getDate() + 21); // 3 week loan
	await updateBook(title, book);
}

export async function returnBook(title: string) {
	const book: Book = await getBook(title);
	book.borrowed = false;
	book.dueDate = new Date();
	book.borrower = null;
	await updateBook(title, book);
}
