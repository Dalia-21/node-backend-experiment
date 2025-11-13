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
}
