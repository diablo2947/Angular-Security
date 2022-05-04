import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  returnUrl: string | undefined;

  constructor(
    private messageService: MessageService,
    private securityService: SecurityService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.returnUrl =
      this.activatedRoute.snapshot.queryParamMap.get('returnUrl')!;
  }

  login(): void {
    this.messageService.clearAll();
    this.securityObject?.init();
    this.securityService.login(this.user).subscribe((resp) => {
      localStorage.setItem('AuthObject', JSON.stringify(resp));
      this.securityObject = resp;
      if (this.returnUrl) this.router.navigateByUrl(this.returnUrl);
    });
  }
}
