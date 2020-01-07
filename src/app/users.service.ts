import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';

/**
 * Dummy service for getting users ids (in real life would depend on HttpClient and send http request for users
 */
@Injectable()
export class UsersService {

  constructor() {
  }

  getUserIds(): Observable<string[]> {
    return of(['User1', 'User2', 'User3']);
  }

}
