import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AppUser } from 'src/app/security/app-user';
import { AppUserAuth } from 'src/app/security/app-user-auth';
import { ConfigurationService } from '../configuration/configuration.service';
import { MessageService } from '../messaging/message.service';

const API_ENDPOINT = 'security/';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class SecurityService {
  securityObject: AppUserAuth = new AppUserAuth();
  apiUrl: string = '';

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private configService: ConfigurationService
  ) {
    this.apiUrl = this.configService.settings.apiUrl + API_ENDPOINT;
  }

  login(entity: AppUser): Observable<AppUserAuth> {
    delete entity.useId;
    return this.http
      .post<AppUserAuth>(this.apiUrl + 'login', entity, httpOptions)
      .pipe(
        tap((x) => {
          Object.assign(this.securityObject, x);
        }),
        catchError(
          this.handleError<AppUserAuth>(
            'login',
            'Invalid username/password',
            new AppUserAuth()
          )
        )
      );
  }

  logout(): void {
    this.securityObject.init();
  }

  private handleError<T>(operation = 'operation', msg = '', result?: T) {
    // Add error messages to message service
    return (error: any): Observable<T> => {
      // Clear any old messages
      this.messageService.clearExceptionMessages();
      this.messageService.clearValidationMessages();

      msg = 'Status Code: ' + error.status + ' - ' + msg || '';

      console.log(msg + ' ' + JSON.stringify(error));

      // Set the last exception generated
      this.messageService.lastException = error;

      switch (error.status) {
        case 400: // Model State Error
          if (error.error) {
            // Add all error messages to the validationMessages list
            Object.keys(error.error.errors).map((keyName) =>
              this.messageService.addValidationMessage(
                error.error.errors[keyName][0]
              )
            );
            // Reverse the array so error messages come out in the right order
            this.messageService.validationMessages =
              this.messageService.validationMessages.reverse();
          }
          break;
        case 404:
          this.messageService.addExceptionMessage(msg);
          break;
        case 500:
          this.messageService.addExceptionMessage(error.error);
          break;
        case 0:
          this.messageService.addExceptionMessage(
            'Unknown error, check to make sure the Web API URL can be reached.' +
              ' - ERROR: ' +
              JSON.stringify(error)
          );
          break;
        default:
          this.messageService.addException(error);
          break;
      }

      // Return default configuration values
      return of(result as T);
    };
  }
}
