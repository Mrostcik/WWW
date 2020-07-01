import {createTables} from "./typescripts/database";
import * as sqlite from 'sqlite3';

const db = new sqlite.Database("quizy.db");
createTables(db);