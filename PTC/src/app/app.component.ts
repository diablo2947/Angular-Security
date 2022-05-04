import { Component, OnInit } from '@angular/core';
import { AppUserAuth } from './security/app-user-auth';
import { ConfigurationService } from './shared/configuration/configuration.service';
import { SecurityService } from './shared/security/security.service';

@Component({
  selector: 'ptc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'PTC';
  securityObject!: AppUserAuth;

  constructor(
    private configService: ConfigurationService,
    private securityService: SecurityService
  ) {
    this.securityObject = securityService.securityObject;
  }

  ngOnInit(): void {
    this.configService
      .getSettings()
      .subscribe((settings) => (this.configService.settings = settings));
  }
  logout(): void {
    this.securityService.logout();
    this.securityObject = this.securityService.securityObject;
  }
}
