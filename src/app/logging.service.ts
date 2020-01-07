/**
 * Created by Evgeny Barabanov on 26/04/2018.
 */

import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {tap} from 'rxjs/operators';

/**
 * Dummy service for centralizer logs (in real life would depend on HttpClient and send the logs to the server)
 */
@Injectable()
export class LoggingService {
  info(message: string): Observable<string> {
    return of(message).pipe(tap(msg => console.log(msg)));
  }

  error(message: string): Observable<string> {
    return of(message).pipe(tap(msg => console.error(msg)));
  }
}
