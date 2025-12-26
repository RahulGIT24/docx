import { Pool } from "pg";
import { connectToDB } from "../db/pool";

export class Database {
    pool: Pool;

    constructor(url: string) {
        this.pool = connectToDB(url)
    }

    async isDocAccessible(doc_token: string) {
        if(!this.pool) return;
        const { rowCount, rows } = await this.pool.query(`SELECT * FROM "Documents" WHERE "sharingToken" = $1 and "editAccess" = true`, [doc_token]);
        if (rowCount === 1) {
            const documentData = rows[0]; // This is your data object
            return documentData.id;
        }

        return null;
    }

}