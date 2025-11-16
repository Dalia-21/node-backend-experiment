import * as fs from 'node:fs/promises';
import { type Book } from './types.js';

const dbName: string = "./book.db";

export class BookRepository {

	async findAll(): Promise<Book[]> {
		try {
			const books: Book[] = new Array();
			const db: fs.FileHandle = await fs.open(dbName, 'r');
			for await (const line of db.readLines()) {
				books.push(JSON.parse(line));
			}
			db.close();
			return books;
		} catch(error) {
			console.error("An error occurred while reading db:", error.message);
		}
	}

	async findByTitle(title: string): Promise<Book> {
		try {
			const db: fs.FileHandle = await fs.open(dbName, 'r');
			for await (const line of db.readLines()) {
				const book: Book = JSON.parse(line);
				if (book.title === title) {
					db.close();
					return book;
				}
			}
			return null;
		} catch(error) {
			console.error("An error occurred while reading db:", error.message);
		}
	}

	async save(book: Book) {
		try {
			const db: fs.FileHandle = await fs.open(dbName, 'a');
			await db.appendFile(JSON.stringify(book) + "\n");
			db.close();
			console.log("Book", book, "successfully saved.");
		} catch(error) {
			console.error("An error occurred while saving", book, ":", error.message);
		}
	}

	// Obviously life would be so much easier if I fixed field lengths
	async update(newRecord: Book) {
		try {
			let db: fs.FileHandle = await fs.open(dbName, 'r');
			let book: Book = null;
			const updatedBooks: string[] = new Array();
			updatedBooks.push(JSON.stringify(newRecord));
			
			let filePos: number = 0;
			let recordFound = false;
			for await (const line of db.readLines()) {
				book = JSON.parse(line);
				
				if (!recordFound && book.title === newRecord.title) { // found record line in db
					recordFound = true;
				} else {
					if (recordFound) { // already found record: push all subsequent records
						updatedBooks.push(JSON.stringify(book));
					} else { // record not yet found
						filePos += line.length;
					}
				}
			
			}
			filePos += 1; // Increment by one for the newline after previous line and one for start pos
			db.close();
			
			fs.truncate(dbName, filePos); // trim file to only include records above updated one
			db = await fs.open(dbName, 'a');
			await db.appendFile(updatedBooks.join("\n"));
			db.close();
		
		} catch(error) {
			console.error("An error occurred while updating", newRecord, ":", error.message);
		}
	}
}

