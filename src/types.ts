export interface Book {
	title: string;
	author: string;
	borrowed: boolean;
	publicationDate: Date;
	dueDate: Date;
	borrower: Patron;
}

export interface Patron {
	name: string;
	age: number;
	borrowedBooks: Book[];
}
