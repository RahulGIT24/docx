import { pool } from '../db/pool'

export class Database {

    async isDocAccessible(doc_token: string) {
        const { rowCount,rows } = await pool.query(`SELECT * FROM "Documents" WHERE "sharingToken" = '$1' and "editAccess" = 'False'`, [doc_token]);
        if (rowCount === 1) {
            const documentData = rows[0]; // This is your data object
            return documentData.id;
        }

        return null;
    }

}