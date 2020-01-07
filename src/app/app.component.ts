import {Component} from '@angular/core';
import {PermissionsService} from './permissions.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  permissions: Observable<{ [id: string]: string[] }>;
  users: Observable<string[]>;

  constructor(permissionsService: PermissionsService) {
    this.permissions = permissionsService.getAllUsersPermissions();
  }

  getUsers(permissions: { [id: string]: string[] }) {
    return Object.keys(permissions);
  }
}
