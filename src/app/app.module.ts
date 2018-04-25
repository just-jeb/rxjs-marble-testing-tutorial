import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import {PermissionsService} from './permissions.service';
import {UsersService} from './users.service';
import {HttpClientModule} from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [PermissionsService, UsersService],
  bootstrap: [AppComponent]
})
export class AppModule { }
