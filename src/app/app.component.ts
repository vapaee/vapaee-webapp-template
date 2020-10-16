import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppService } from './services/common/app.service';
import { DropdownService, LocalStringsService } from './services/common/common.services';
import { VapaeeStyle } from './services/vapaee/style/style.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

    constructor(
      public local: LocalStringsService,
      public app: AppService,
      public dropdown: DropdownService,
      public style: VapaeeStyle,
      private platform: Platform,
      private splashScreen: SplashScreen,
      private statusBar: StatusBar
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }
    
}
