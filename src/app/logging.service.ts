/**
 * Created by Evgeny Barabanov on 26/04/2018.
 */

import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';

/**
 * Dummy service for centralizer logs (in real life would depend on HttpClient and send the logs to the server)
 */
@Injectable()
export class LoggingService {
  info(message: string): Observable<string> {
    return of(message);
  }

  error(message: string): Observable<string> {
    return of(message);
  }
}
