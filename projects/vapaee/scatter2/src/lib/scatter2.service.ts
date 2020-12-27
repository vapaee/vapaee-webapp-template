import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// https://github.com/GetScatter/scatter-js#user-content-want-some-quick-code
import ScatterJS from '@scatterjs/core';
import ScatterEOS from '@scatterjs/eosjs2';
import {JsonRpc, Api} from 'eosjs';
import { ScatterUtils } from './utils.class';
import { Feedback } from '../feedback/feedback.service';
import { Subject } from 'rxjs';
import { Asset } from './asset.class';
import { Token } from './token.class';
import { EOSNetworkConnexion } from './eos-connexion.class';
import { Account, AccountData, Limit, Network, NetworkMap, VapaeeScatterConnexion } from './types-scatter2';
import { connected } from 'process';

export interface VapaeeScatterInterface {
    createConnexion: (appname:string, net_slug:string)=> Promise<VapaeeScatterConnexion>;
    getNetwork: (slug: string) => Network;
    resetIdentity: () => Promise<void>;
}
export interface ConnexionMap {
    [key:string]:VapaeeScatterConnexion
};

@Injectable({
    providedIn: "root"
})
export class VapaeeScatter2 implements VapaeeScatterInterface /*, VapaeeScatterConnexion */ {
    
    public appname: string;
    public connexion: ConnexionMap = {};
    public default_conn: string; // esto debería ser privado
    public onNetworkChange:Subject<Network> = new Subject();
    public feed: Feedback;

    private _networks: NetworkMap = {};
    private _networks_slugs: string[] = [];

    private setEndpointsReady: Function;
    public waitEndpoints: Promise<any> = new Promise((resolve) => {
        this.setEndpointsReady = resolve;
    });

    constructor(
        private http: HttpClient,
    ) {
        this.feed = new Feedback();
        console.log("VapaeeScatter2()");
    }

    get networks(){
        return this._networks_slugs;
    }

    getNetwork(slug: string): Network {
        return this._networks[slug];
    }

    scattercontext = null;
    /*
    cloneScatterContext() {
        console.log("------ cloneScatterContext ------");

        console.log("ScatterJS.scatter: ");
        for (let i in ScatterJS.scatter) {
            console.log(" - ", i, typeof ScatterJS.scatter[i]);
        }


        this.scattercontext = JSON.parse(JSON.stringify(ScatterJS.scatter));
        ScatterJS.scatter = this.scattercontext;


        console.log("this.scattercontext: ");
        for (let i in this.scattercontext) {
            console.log(" - ", i, typeof this.scattercontext[i]);
        }

        console.log("-----------");
    }
    */


    
    async init(path:string) {
        // init es llamado por la app donde además le pasan el parámetro de config de donde tomar los endpoints.
        // este hace un setEndpoints(...)
        // 

        
        // this.cloneScatterContext();

        
        let endpoints = await this.fetchEndpoints(path);
        this.setEndpoints(endpoints);
    }

    private async fetchEndpoints(url:string): Promise<NetworkMap> {
        this.feed.setLoading("endpoints");
        return this.http.get<NetworkMap>(url).toPromise().then((response) => {
            console.log("ScatterService.fetchEndpoints()", response);
            return response;
        }).catch(e => {
            console.warn("WARNING: endpoint not responding", e);
            throw e;
        }).finally(() => {
            this.feed.setLoading("endpoints", false);
        });
    }

    private setEndpoints(endpoints: NetworkMap) {
        console.log("ScatterService.setEndpoints()", [endpoints]);
        this._networks = endpoints || this._networks;
        for (let slug in this._networks) {
            this._networks_slugs.push(slug);
            this.connexion[slug] = new EOSNetworkConnexion(this, slug, this.http);
        }        
        this.setEndpointsReady();
    }

    async createConnexion(appname:string, slug:string): Promise<VapaeeScatterConnexion> {
        console.log("ScatterService.createConnexion()", [appname, slug]);
        this.appname = appname;
        this.feed.setLoading("connexion");
        return new Promise<VapaeeScatterConnexion>(async (resolve, reject) => {
            setTimeout(_ => {
                if (this.feed.loading("connexion")) {
                    this.feed.setLoading("connexion", false);
                    this.feed.setLoading("set-network", false);
                    reject("ScatterService.createConnexion() TIME OUT");    
                }
            }, 10 * 1000);
            await this.waitEndpoints;
            console.assert(typeof this.connexion[slug] == "object", "ERROR: inconsistency error. Connexion for " + slug + " does not exist");
            await this.connexion[slug].autoSelectEndPoint(slug);
            await this.connexion[slug].connect(this.appname);
            resolve(this.connexion[slug]);
            this.feed.setLoading("connexion", false);
        });
    };


    

    // ------------------------------------------------------------------------------------------------------------------
    // old API for retocompatibility ------------------------------------------------------------------------------------
    // ------------------------------------------------------------------------------------------------------------------
    private get symbol(): string {
        return this.networks[this.default_conn].symbol;
    }

    /*private async aux_default_async_call(function_name:string, params:any[] = []): Promise<any> {
        await this.waitEndpoints;

        console.log("aux_default_async_call("+function_name+") luego del waitEndpoints", params);

        console.assert(typeof this.default_conn == "string", "ERROR: MUST call setNetwork(network_slug:string) before calling " + function_name);
        console.assert(typeof this._networks[this.default_conn] != "undefined", "ERROR: MUST call setNetwork(network_slug:string) before calling " + function_name);
        console.assert(typeof this.connexion[this.default_conn] != "undefined", "ERROR: MUST call setNetwork(network_slug:string) before calling " + function_name);
        console.assert(typeof this.connexion[this.default_conn][function_name] == "function", "ERROR: inconsistency error! " + function_name + " does not exist in connexion object");
        let func:Function = this.connexion[this.default_conn][function_name];
        let result = await func.call(this.connexion[this.default_conn], params);
        return result;
    }*/

    private aux_default_call(function_name:string, params:any[] = []): any {
        console.assert(typeof this.default_conn == "string", "ERROR: MUST call setNetwork(network_slug:string) before calling " + function_name);
        let func:Function = this.connexion[this.default_conn][function_name];
        let result = func.call(this.connexion[this.default_conn], params);
        return result;
    }

    private async aux_asserts(function_name:string) {
        await this.waitEndpoints;
        console.assert(typeof this.default_conn == "string", "ERROR: MUST call setNetwork(network_slug:string) before calling " + function_name);
        console.assert(typeof this._networks[this.default_conn] != "undefined", "ERROR: MUST call setNetwork(network_slug:string) before calling " + function_name);
        console.assert(typeof this.connexion[this.default_conn] != "undefined", "ERROR: MUST call setNetwork(network_slug:string) before calling " + function_name);
        console.assert(typeof this.connexion[this.default_conn][function_name] == "function", "ERROR: inconsistency error! " + function_name + " does not exist in connexion object");

    }

    async setNetwork(slug:string) {
        console.error("ScatterService.setNetwork("+slug+") DEPRECATED ");
        this.feed.setLoading("set-network", false);
        return this.waitEndpoints.then(async () => {
            let connexion = this.connexion[slug];
            console.assert(typeof connexion == "object", "ERROR: inconsistency error. Connexion for " + slug + " does not exist");
            if (!this.default_conn || this.default_conn != slug) {
                this.default_conn = slug;
                this.onNetworkChange.next(this.getNetwork(slug));
            }            
            await connexion.autoSelectEndPoint(slug);
            // await this.resetIdentity();
            // await this.initScatter();

            this.feed.setLoading("set-network", false);
            return connexion;
        });
    }
    
    // Connexion ------------------------------------------
    async connect(appname:string) {
        await this.aux_asserts("connect");
        return this.connexion[this.default_conn].connect(appname);
    }

    // Acount, Identity and authentication -----------------
    async resetIdentity() {
        ScatterJS.forgetIdentity();
        for (let i in this.connexion) {
            this.connexion[i].resetIdentity();
        }
        
    }
    async updateAccountData() {
        await this.aux_asserts("updateAccountData");
        return this.connexion[this.default_conn].updateAccountData();
    }

    // Networks (eosio blockchains) & Endpoints -----------------
    async autoSelectEndPoint(slug:string) {
        await this.aux_asserts("autoSelectEndPoint");
        return this.connexion[this.default_conn].autoSelectEndPoint(slug);        
    }

    
    // Scatter initialization and AppConnection -----------------
    async initScatter() {
        await this.aux_asserts("initScatter");
        return this.connexion[this.default_conn].initScatter();
    }
    async retryConnectingApp() {
        await this.aux_asserts("retryConnectingApp");
        return this.connexion[this.default_conn].retryConnectingApp();
    }
    async connectApp(appname:string) {
        await this.aux_asserts("connectApp");
        return this.connexion[this.default_conn].connectApp(appname);
    }
    

    // AccountData and Balances ---------------------------------
    calculateTotalBalance(account) {
        return new Asset("0.0000 " + this.symbol)
            .plus(account.core_liquid_balance_asset)
            .plus(this.calculateTotalStaked(account));
    }

    calculateTotalStaked(account) {
        return new Asset("0.0000 " + this.symbol)
            .plus(account.refund_request.connexion_amount_asset)
            .plus(account.refund_request.cpu_amount_asset)
            .plus(account.self_delegated_bandwidth.cpu_weight_asset)
            .plus(account.self_delegated_bandwidth.connexion_weight_asset);
    }

    calculateResourceLimit(limit) {
        limit = Object.assign({
            max: 0, used: 0
        }, limit);
        
        if (limit.max != 0) {
            limit.percent = 1 - (Math.min(limit.used, limit.max) / limit.max);
        } else {
            limit.percent = 0;
        }
        limit.percentStr = Math.round(limit.percent*100) + "%";
        return limit;
    }

    async queryAccountData (name:string): Promise<AccountData> {
        await this.aux_asserts("queryAccountData");
        return this.connexion[this.default_conn].queryAccountData(name);
    }

    async executeTransaction(contract:string, action:string, data:any): Promise<any>{
        await this.aux_asserts("executeTransaction");
        return this.connexion[this.default_conn].executeTransaction(contract, action, data);
    }

    async getContractWrapper(account_name:string): Promise<any> {
        await this.aux_asserts("getContractWrapper");
        return this.connexion[this.default_conn].getContractWrapper(account_name);
    }
    
    // loginTimer;
    async login() {
        await this.aux_asserts("login");
        return this.connexion[this.default_conn].login();
    }

    async logout() {
        await this.aux_asserts("logout");
        return this.connexion[this.default_conn].logout();
    }

    async getTableRows (contract, scope, table, tkey, lowerb, upperb, limit, ktype, ipos): Promise<any> {
        await this.aux_asserts("getTableRows");
        return this.connexion[this.default_conn].getTableRows(contract, scope, table, tkey, lowerb, upperb, limit, ktype, ipos);
    }

    isNative (thing: Asset | Token): boolean {
        return <boolean>this.aux_default_call("isNative", [thing]);
    }

}
