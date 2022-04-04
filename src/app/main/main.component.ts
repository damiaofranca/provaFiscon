import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { DataUser } from '../services/User';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['Nome', 'Telefone', 'Ações'];
  users: DataUser[] | any = [];
  dataUsers = new MatTableDataSource(this.users);
  constructor(public dialog: MatDialog, private userService: UsersService) {
    this.users = [];
  }

  ngAfterViewInit() {
    this.dataUsers.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.userService.getUsers().snapshotChanges().pipe(
      map((changes: any[]) =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      this.users = data;
      this.dataUsers.data = this.users;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataUsers.filter = filterValue.trim().toLowerCase();
  }


  deleteUser(user: DataUser) {
    this.userService.deleteUser(user);
  }

  openDialogAdd() {
    this.dialog.open(AddUserDialog);
  }
}

@Component({
  selector: 'add-user-dialog',
  templateUrl: './add-user.html',
  styleUrls: ['./main.component.scss'],
})
export class AddUserDialog implements OnInit {
  userForm = new FormGroup({
    name: new FormControl('',Validators.required),
    phone: new FormControl('',Validators.required),
  });
  constructor(private userService: UsersService,public dialog: MatDialog,) {}
  ngOnInit(): void {
    this.userService.getUsers()
  }

  submitUser() {
    if (this.userForm.valid) {
      this.userService.addUser(this.userForm.value);
      this.userForm.reset();
      this.dialog.closeAll();
    }
  }
}
