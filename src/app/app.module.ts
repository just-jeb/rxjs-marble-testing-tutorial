import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import {PermissionsService} from './permissions.service';
import {UsersService} from './users.service';
import {HttpClientModule} from '@angular/common/http';
import {LoggingService} from './logging.service';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [PermissionsService, UsersService, LoggingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
