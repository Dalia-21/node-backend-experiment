import { type Patron } from "./types.js";
import { PatronRepository } from "./patron-repository.js";

const patronRepository: PatronRepository = new PatronRepository();

export async function listPatrons(): Promise<Patron[]> {
	return patronRepository.findAll();
}

export function getPatron(name: string): Promise<Patron> {
	return patronRepository.findByName(name);
}

export function createPatron(patron: Patron) {
	if (patron.name === undefined ||
			patron.age === undefined) {
		throw new Error("Name and age required to create new entry. Some fields were missing: " + JSON.stringify(patron));
	}
	patron.borrowedBooks = new Array();
	patronRepository.save(patron);
}

export function updatePatron(name: string, patron: Patron) {
	if (patron.name === undefined &&
			patron.age === undefined &&
			patron.borrowedBooks === undefined) {
		throw new Error("Insufficient data provided for update");
	}
	patronRepository.findByName(name).then((existingRecord) => {
		let modified: boolean = false;
		if (patron.name !== undefined && existingRecord.name !== patron.name) {
			existingRecord.name = patron.name;
			modified = true;
		}
		if (patron.age !== undefined && existingRecord.age !== patron.age) {
			existingRecord.age = patron.age;
			modified = true;
		}
		if (patron.borrowedBooks !== undefined && existingRecord.borrowedBooks !== patron.borrowedBooks) {
			existingRecord.borrowedBooks = patron.borrowedBooks;
			modified = true;
		}
		if (!modified) {
			console.error("Record is already up to date or insufficient data for update");
		} else {
			patronRepository.update(existingRecord);
		}
	});
}

// One thing to note about the way updates are handled right now:
// If a book's title gets updated while it is on loan to a patron,
// this will cause the return update to fail, as it will not be
// updated in the patron's record, since the dbs don't actually
// have any sort of linking. One way to prevent this would be to disable 
// metadata updates while a book is on loan.

export function borrowBook(title: string, name: string) {
	getPatron(name).then((patron) => {
		if (patron.borrowedBooks === undefined) {
			patron.borrowedBooks = new Array();
		}
		if (patron.borrowedBooks.includes(title)) {
			throw new Error("Book " + title + " already loaned to " + patron.name);
		}
		patron.borrowedBooks.push(title);
		updatePatron(name, patron);
	});
}

// This is an inefficient way of searching for the patron who has borrowed this book
// A foreign key would make this easier
export function returnBook(title: string) {
	listPatrons().then((patrons) => {
		let patronToUpdate: Patron = null;
		let i: number = 0;
		for (const patron of patrons) {
			if (patron.borrowedBooks?.includes(title)) {
				patronToUpdate = patron;
				break;
			}
			i++;
		}
		if (!patronToUpdate) {
			throw new Error("Book " + title + " was not borrowed by any patron");
		}
		patronToUpdate.borrowedBooks.splice(i, 1);
		updatePatron(patronToUpdate.name, patronToUpdate); // Overloading for another signature would be ideal here
	});
}

