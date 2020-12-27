import { Component, OnInit, OnDestroy, HostBinding, ElementRef } from '@angular/core';
import { Subscriber } from 'rxjs';
import { AppService, OnEnterPageHandler, VpeAppPage } from 'src/app/services/common/app.service';
import { LocalStringsService } from 'src/app/services/common/common.services';

import { IonicModule } from '@ionic/angular';
import { VapaeeScatter } from '@vapaee/scatter';

import ScatterJS from '@scatterjs/core';

@Component({
    selector: 'scatter-page',
    templateUrl: './scatter.page.html',
    styleUrls: ['./scatter.page.scss', '../common.page.scss']
})
export class ScatterPage implements OnInit, OnDestroy, VpeAppPage {
   
    @HostBinding('class') class = 'app-page scatter';
    timer: number;
    showFiller;
    appname:string = "@vapaee/scatter";
    constructor(
        public app: AppService,
        public local: LocalStringsService,
        public scatter: VapaeeScatter,
        public elementRef: ElementRef
    ) {
        
    }

    async ngOnInit() {
        console.debug("ScatterPage.ngOnInit()");
        this.app.subscribePage(this);
        let slug = "telos";

        await this.scatter.init("assets/endpoints.json");
        // await this.scatter.setNetwork(slug)
        // await this.scatter.connectApp(this.appname);
    }
    
    ngOnDestroy() {
        console.debug("ScatterPage.ngOnDestroy()");
        this.app.unsubscribePage(this);
    }

    async connectApp() {
        console.log("ScatterPage.connectApp()");
        await this.scatter.connectApp(this.appname);
    }

    async tryToConnect(network_slug:string) {
        console.log("ScatterPage.tryToConnect("+network_slug+") ---> createConnexion()");
        let conn = await this.scatter.createConnexion(network_slug);
        console.log("ScatterPage.tryToConnect("+network_slug+") ---> connect()");
        await conn.connect(this.appname);
        console.log("ScatterPage.tryToConnect("+network_slug+") ---> login()");
        await conn.login();
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

    aux_transaction(slug:string) {
        console.log("aux_transaction("+slug+")");
        console.assert(typeof this.scatter.connexion[slug] != "undefined", "ERROR: connexion "+slug+" not found");

        let contract = this.scatter.connexion[slug].getContract("eosio.token");
        contract.excecute([
            {
                action: "transfer",
                payload: {
                    from: this.scatter.connexion[slug].account.name,
                    to: 'gqydoobuhege',
                    quantity: '0.0001 ' + this.scatter.connexion[slug].symbol,
                    memo: "testing",
                },
            },
            {
                action: "transfer",
                payload: {
                    from: this.scatter.connexion[slug].account.name,
                    to: 'gqydoobuhege',
                    quantity: '0.0002 ' + this.scatter.connexion[slug].symbol,
                    memo: "testing",
                },
            }
        ]);
    }

    debug() {
        console.log("--- Scatter Page ---");
        console.log(this);

        console.log("--- ScatterJS ---");
        console.log("ScatterJS.scatter.identity: ", ScatterJS.scatter.identity);
        console.log("ScatterJS.scatter.network: ", ScatterJS.scatter.network);
        console.log("ScatterJS.scatter: ", ScatterJS.scatter);

        if (this.scatter.connexion["telos"]) {
            console.log("--- Telos Connexion ---");
            this.scatter.connexion["telos"].print();
        }

        if (this.scatter.connexion["eos"]) {
            console.log("--- EOS Connexion ---");
            this.scatter.connexion["eos"].print();
        }

    }
}
