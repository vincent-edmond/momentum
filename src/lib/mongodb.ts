import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI!;
const DB_NAME = "momentum";

// ─── Singleton client (compatible Next.js hot-reload) ────────────────────────

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!uri) {
  throw new Error("MONGODB_URI manquant dans les variables d'environnement.");
}

if (process.env.NODE_ENV === "development") {
  // En dev, on réutilise le client entre les hot-reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function getDb(): Promise<Db> {
  const c = await clientPromise;
  return c.db(DB_NAME);
}

export default clientPromise;
