import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp } from "firebase/app";
import { environment } from '../environments/environment';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { RegisterComponent } from './component/register/register.component';
import { ChatBoxComponent } from './component/chat/chat-box/chat-box.component';
import { ChatListComponent } from './component/chat/chat-list/chat-list.component';
import { ChatComponent } from './component/chat/chat.component';
import { LoginComponent } from './component/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { UtcToIndianTimePipe } from './shared/pipe/utc-to-indian-time.pipe';
import { ConfirmationComponent } from './shared/component/confirmation/confirmation.component';

import { ModalModule } from 'ngx-bootstrap/modal';
import { DndDirective } from './shared/directives/dnd.directive';
import { TimeAgoPipe } from './shared/pipe/time-ago.pipe';
import { ChatlistTimeAgoPipe } from './shared/pipe/chatlist-time-ago.pipe';

initializeApp(environment.firebase);
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ChatComponent,
    ChatListComponent,
    ChatBoxComponent,
    UtcToIndianTimePipe,
    ConfirmationComponent,
    DndDirective,
    TimeAgoPipe,
    ChatlistTimeAgoPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    PickerModule,
    ToastrModule.forRoot(),
    ModalModule.forRoot()
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
