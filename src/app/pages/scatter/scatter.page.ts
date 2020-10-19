import { Component, OnInit, OnDestroy, HostBinding, ElementRef } from '@angular/core';
import { Subscriber } from 'rxjs';
import { AppService, OnEnterPageHandler, VpeAppPage } from 'src/app/services/common/app.service';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { VapaeeScatter2 } from 'src/app/services/vapaee/scatter2/scatter2.service';




@Component({
    selector: 'scatter-page',
    templateUrl: './scatter.page.html',
    styleUrls: ['./scatter.page.scss', '../common.page.scss']
})
export class ScatterPage implements OnInit, OnDestroy, VpeAppPage {
   
    @HostBinding('class') class = 'app-page scatter';
    timer: number;
    showFiller;
    constructor(
        public app: AppService,
        public local: LocalStringsService,
        public scatter: VapaeeScatter2,
        public elementRef: ElementRef
    ) {
        this.scatter.init("assets/endpoints.json");
    }

    async tryToConnect(network_slug:string) {
        console.log("ScatterPage.tryToConnect("+network_slug+") ---> createConnextion()");
        await this.scatter.createConnextion("@vapaee/scatter", network_slug);
        console.log("ScatterPage.tryToConnect("+network_slug+") ---> login()");
        await this.scatter.net[network_slug].login();
    }

    disconnectFrom(network_slug:string) {
        console.error("NOT IMPLEMENTED");
    }

    path: RegExp = /\/scatter/g;
    page: OnEnterPageHandler;
    onEnterPage() {
        console.debug("ScatterPage.onEnterPage()");
    }

    onResizeSuscriber: Subscriber<any>;
    onResize() {
        console.debug("ScatterPage.onResize()");
    }

    ngOnInit() {
        console.debug("ScatterPage.ngOnInit()");
        this.app.subscribePage(this);
    }
    
    ngOnDestroy() {
        console.debug("ScatterPage.ngOnDestroy()");
        this.app.unsubscribePage(this);
    }

    debug() {
        console.log(this);
    }
}
