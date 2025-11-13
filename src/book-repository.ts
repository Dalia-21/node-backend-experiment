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

	async update(newRecord: Book) {
		try {
			let db: fs.FileHandle = await fs.open(dbName, 'r');
			const books: Book[] = new Array();
			for await (const line of db.readLines()) {
				books.push(JSON.parse(line));
			}
			db.close();
			let i: number = 0;
			for (const book of books) {
				if (book.title === newRecord.title) {
					break;
				}
				i++;
			}
			if (i === books.length) {
				console.error("Record", newRecord.title, "not found for update");
				return;
			}
			books.splice(i, 1, newRecord);
			db = await fs.open(dbName, 'w');
			let booksStringList: string[] = new Array();
			for (const book of books) {
				booksStringList.push(JSON.stringify(book));
			}
			// This is obviously an insane way to maintain a database
			// It's been fun to implement, and I could optimise it by trying to
			// write single records in place, but professional databases
			// exist for a reason...
			await db.writeFile(booksStringList.join("\n"));
			db.close();
		} catch(error) {
			console.error("An error occurred while updating", newRecord, ":", error.message);
		}
	}
}

