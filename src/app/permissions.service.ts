import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {UsersService} from './users.service';
import {HttpClient} from '@angular/common/http';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {combineLatest} from 'rxjs/observable/combineLatest';
import {LoggingService} from './logging.service';


@Injectable()
export class PermissionsService {

  constructor(private users: UsersService, private log: LoggingService, private http: HttpClient) {
  }

  getAllUsersPermissions(): Observable<{ [id: string]: string[] }> {
    // get user ids from users service
    return this.users.getUserIds().pipe(
      // get user permissions for each user
      switchMap(userIds => combineLatest(userIds.map(id => this.getUserPermissions(id)))),
      // merge multiple user permissions objects to a single object
      map(usersPermissions => usersPermissions.reduce((acc, cur) => ({...acc, ...cur}), {})),
      // log success
      tap(() => this.log.info('Successfully retrieved users permissions')),
      // log error and return empty object
      catchError(e => this.log.error(`Failed to retrieve users permissions: ${e}`).pipe(map(() => ({}))))
    );
  }

  getUserPermissions(userId: string): Observable<{ [id: string]: string[] }> {
    // Http call to get permissions for specific user
    return this.http.post('https://httpbin.org/post', {userId, permissions: ['write', 'read']}).pipe(
      // Take the relevant part of the response
      map(response => JSON.parse(response['data'])),
      // Identify the response with user id
      map(data => ({[userId]: data['permissions']}))
    );
  }

}
