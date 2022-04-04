import { Injectable } from '@angular/core';
import {
  AngularFireDatabase,
  AngularFireList,
} from '@angular/fire/compat/database';
import { DataUser } from './User';
@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private pathUsers = '/users';
  userRefFirebase: AngularFireList<DataUser>;

  constructor(private db: AngularFireDatabase) {
    this.userRefFirebase = db.list(this.pathUsers);
  }

  addUser(user: DataUser) {
    this.userRefFirebase.push(user);
  }

  getUsers(){
    return this.userRefFirebase;
  }

  deleteUser(user: DataUser) {
    this.userRefFirebase.remove(user.key);
  }

}
