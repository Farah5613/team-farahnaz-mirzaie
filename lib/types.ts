export type Car = {
  _id?: string;
  _rev?: string;
  title: string;
  description: string;
  image: string;
};

export type CouchDocument = Car | null;
