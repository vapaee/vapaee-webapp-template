import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

// import { SidebarModule } from 'ng-sidebar';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { PagesModule } from './pages/pages.module';
import { DirectivesModule } from './directives/directives.module';

import { CommonServicesModule } from './services/common/common.module';
import { VapaeeComponentsModule } from './components/vapaee/vapaee-components.module';
import { AngularMaterialModule } from './components/vapaee/angular.material.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { VapaeeStyle } from '@vapaee/style';
import { VapaeeScatter } from '@vapaee/scatter';
import { CookieService } from 'ngx-cookie-service';

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],  
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        PagesModule,
        DirectivesModule,
        CommonServicesModule,
        VapaeeComponentsModule,
        AngularMaterialModule,
        NgbModule
    ],
    providers: [
      StatusBar,
      SplashScreen,
      VapaeeStyle,
      VapaeeScatter,
      CookieService,
      { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
    ],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
