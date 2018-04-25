import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {UsersService} from './users.service';
import {HttpClient} from '@angular/common/http';
import {map, switchMap} from 'rxjs/operators';
import {combineLatest} from 'rxjs/observable/combineLatest';


@Injectable()
export class PermissionsService {

  constructor(private users: UsersService, private http: HttpClient) {
  }

  getAllUsersPermissions(): Observable<{ [id: string]: string[] }> {
    return this.users.getUserIds().pipe(
      switchMap(userIds => combineLatest(userIds.map(id => this.getUserPermissions(id)))),
      map(usersPermissions => usersPermissions.reduce((acc, cur) => ({...acc, ...cur}), {}))
    );
  }

  getUserPermissions(userId: string): Observable<{ [id: string]: string[] }> {
    return this.http.post('https://httpbin.org/post', {permissions: ['write', 'read']}).pipe(
      map(response => JSON.parse(response['data'])),
      map(data => ({[userId]: data['permissions']}))
    );
  }

}
