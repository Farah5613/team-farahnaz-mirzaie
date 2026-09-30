import nano from 'nano';
if (!process.env.COUCHDB_URL) {
  throw new Error('COUCHDB_URL is missing from environment');
}

export const couch = nano(process.env.COUCHDB_URL);

const DB_NAME = 'cars_db';

async function ensureDatabase() {
  try {
    await couch.db.get(DB_NAME);
    console.log(`Database "${DB_NAME}" exists`);
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'statusCode' in error &&
      error.statusCode === 404
    ) {
      await couch.db.create(DB_NAME);
      console.log(`Database "${DB_NAME}" created`);
    } else {
      throw error;
    }
  }
}

export const cars_db = couch.db.use(DB_NAME);

export const couchReady = ensureDatabase();
