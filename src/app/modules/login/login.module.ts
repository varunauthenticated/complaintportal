import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login.component';
import { LoginService } from './services/login.service';
import { HomeModule } from '../home/home.module';
import { SharedModule } from '../shared/shared.module';
import { BusySpinnerModule } from '../widget/busy-spinner/busy-spinner.module';
@NgModule({
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    HomeModule,
    SharedModule,
    BusySpinnerModule   
  ],
  declarations: [
    LoginComponent
  ],
  exports: [
    LoginComponent
  ],
  providers: [
    LoginService,
  ]
})
export class LoginModule { }
