import { type Patron } from "./types.js";
import { PatronRepository } from "./patron-repository.js";

const patronRepository: PatronRepository = new PatronRepository();

export async function listPatrons(): Promise<Patron[]> {
	return patronRepository.findAll();
}

export function getPatron(name: string): Promise<Patron> {
	return patronRepository.findByName(name);
}

export function createPatron(data: string) {
	const patron: Patron = JSON.parse(data);
	if (patron.name === undefined ||
			patron.age === undefined) {
		throw new Error("Name and age required to create new entry. Some fields were missing: " + JSON.stringify(patron));
	}
	patron.borrowedBooks = new Array();
	patronRepository.save(patron);
}
