import { Component, OnInit } from '@angular/core';
import { AppUser } from '../security/app-user';
import { AppUserAuth } from '../security/app-user-auth';
import { MessageService } from '../shared/messaging/message.service';
import { SecurityService } from '../shared/security/security.service';

@Component({
  selector: 'ptc-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  securityObject: AppUserAuth | undefined;
  user: AppUser = new AppUser();
  constructor(
    private messageService: MessageService,
    private securityService: SecurityService
  ) {}

  ngOnInit(): void {}

  login(): void {
    this.messageService.clearAll();
    this.securityObject?.init();
    this.securityService
      .login(this.user)
      .subscribe((resp) => (this.securityObject = resp));
  }
}
