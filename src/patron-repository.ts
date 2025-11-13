import * as fs from 'node:fs/promises';
import { type Patron } from './types.js';

const dbName: string = "./patron.db";

export class PatronRepository {

	async findAll(): Promise<Patron[]> {
		try {
			const patrons: Patron[] = new Array();
			const db: fs.FileHandle = await fs.open(dbName, 'r');
			for await (const line of db.readLines()) {
				patrons.push(JSON.parse(line));
			}
			return patrons;
		} catch(error) {
			console.error("An error occurred while fetching patrons:", error.message);
		}
	}

	async findByName(name: string): Promise<Patron> {
		try {
			const patrons: Patron[] = new Array();
			const db: fs.FileHandle = await fs.open(dbName, 'r');
			for await (const line of db.readLines()) {
				const patron: Patron = JSON.parse(line);
				if (patron.name === name) {
					return patron;
				}
			}
			return null;
		} catch(error) {
			console.error("An error occurred while reading db:", error.message);
		}
	}

	async save(patron: Patron) {
		try {
			const db: fs.FileHandle = await fs.open(dbName, 'a');
			await db.appendFile(JSON.stringify(patron) + "\n");
			db.close();
			console.log("Patron", patron, "successfully saved.");
		} catch(error) {
			console.error("An error occurred while saving", patron, ":", error.message);
		}
	}
}

