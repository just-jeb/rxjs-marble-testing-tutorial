import {Component} from '@angular/core';
import {PermissionsService} from './permissions.service';
import {Observable} from 'rxjs/Observable';
import {map, publishReplay, refCount} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  permissions: Observable<{ [id: string]: string[] }>;
  users: Observable<string[]>;

  constructor(private permissionsService: PermissionsService) {
    this.permissions = permissionsService.getAllUsersPermissions();
  }

  getUsers(permissions: { [id: string]: string[] }) {
    return Object.keys(permissions);
  }
}
