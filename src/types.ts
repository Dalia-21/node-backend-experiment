export interface Book {
	title: string;
	author: string;
	borrowed: boolean;
	publicationDate: Date;
	dueDate: Date;
	borrower: string;
}

export interface Patron {
	name: string;
	age: number;
	borrowedBooks: string[];
}
