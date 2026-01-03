import { Pool } from "pg";

export function connectToDB(url:string) {
  return  new Pool({
    connectionString: url,
    max: 5,
  });
}