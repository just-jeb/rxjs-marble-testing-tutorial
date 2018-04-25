import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';

@Injectable()
export class UsersService {

  constructor() {
  }

  getUserIds(): Observable<string[]> {
    return of(['User1', 'User2', 'User3']);
  }

}
