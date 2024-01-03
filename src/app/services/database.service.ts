import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { BehaviorSubject } from 'rxjs';


const DB_USERS = 'myuserdb';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;
  private users = new BehaviorSubject<User[]>([]);

  constructor() { }

  async initializPlugin()
  {
    this.db = await this.sqlite.createConnection(
      DB_USERS,
      false,
      'no-encryption',
      1,
      false
    );

    await this.db.open();
    const schema = `CREATE TABLE IF NOT EXISTS users(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      birthDate DATE,
      job TEXT,
      tel TEXT,
      active INTEGER DEFAULT 1
    );`;

    await this.db.execute(schema); 

    await this.loadUsers();

    return true;

  } 

  get getUsers() 
  {
     return this.users;
  }

  async loadUsers()
  {
    const users = await this.db.query('SELECT * FROM users WHERE active = 1');
    this.users.next(users.values || []);
  }

  async addUser(user: User) 
  {
    const query = `INSERT INTO users(name,birthDate,job,tel) 
                   VALUES('${user.name}', '${user.birthDate}','${user.job}', '${user.tel}')`;

    const res = await this.db.query(query);
    this.loadUsers();
    return res;
  }

  async removeUser(id: number) 
  {
    const query = `UPDATE users SET active = 0 WHERE id =${id}`;
    const res = await this.db.query(query);
    this.loadUsers();
    return res;
  }

  async updateUser(user:User) 
  {
    const query = `UPDATE users 
                   SET name = '${user.name}',
                   birthDate = '${user.birthDate}',
                   job = '${user.job}',
                   tel = '${user.tel}'
                   WHERE id = ${user.id}`;
    const res = await this.db.query(query);
    this.loadUsers();
    return res;
  }

  
}
 


export interface User 
{
  id:number;
  name:string;
  birthDate: Date;
  job:string;
  tel:string;
  active:number;
}