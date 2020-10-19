import { Subject } from 'rxjs';
import { Feedback } from '../feedback/feedback.service';
import { Asset } from './asset.class';
import { Account, AccountData, Endpoint, EndpointState, Eosconf, GetInfoResponse, Limit, Network, 
        NetworkMap, VapaeeScatterConnexion, VapaeeScatterInterface, EOS } from './scatter2.service';
import { Token } from './token.class';
import { ScatterUtils } from './utils.class';

import ScatterJS from '@scatterjs/core';
import ScatterEOS from '@scatterjs/eosjs2';
import { JsonRpc, Api } from 'eosjs';
import { HttpClient } from '@angular/common/http';


export class NetworkConnexion implements VapaeeScatterConnexion { 
    error: string;
    symbol: string;
    feed: Feedback;
    onEndpointChange:Subject<Network>;
    onLogggedStateChange:Subject<boolean>;
    _account: Account;
    waitReady: Promise<any>;
    waitLogged: Promise<any>;
    waitConnected: Promise<any>;
    waitEosjs: Promise<any>;
    waitEndpoints: Promise<any>;

    utils:ScatterUtils;
    account: Account
    default: Account

    networks: string[];

    username: string;
    authorization: {authorization:string[]};
    

    private _network: Network;
    private eosconf: Eosconf;
    private eos: EOS;
    private rpc: JsonRpc;
    private _connected: boolean;
    private scattNetwork: ScatterJS.Network;

    constructor(
        public scatter: VapaeeScatterInterface,
        public slug: string,
        public http: HttpClient
    ) {
        this.feed = new Feedback();
        ScatterJS.plugins( new ScatterEOS() );
    }

    get logged() {
        return !!this.account;
    }   

    get connected() {
        return this._connected;
    }

    async delay(milisec:number) {
        return new Promise(r => {
            setTimeout(_ => r(), milisec);
        });
    };
    
    async connect(appname:string) {
        console.log("NetworkConnexion.connect("+appname+")");

        if (!this.eosconf) return Promise.reject("eosconf not found. Try await con.autoSelectEndPoint(); first");

        return new Promise(async (resolve, reject) => {

            this.scattNetwork = ScatterJS.Network.fromJson(this.eosconf);
            this.rpc = new JsonRpc(this.scattNetwork.fullhost());        
    
            console.log("this.scattNetwork",this.scattNetwork);
            console.log("rpc", this.rpc);
            console.log("ScatterJS",ScatterJS);
    
            await this.delay(1000);
            const connectionOptions = {initTimeout:1800, network:this.scattNetwork};
            ScatterJS.connect(appname, connectionOptions).then(async connected => {
                this._connected = connected;
                if(!this.connected) {
                    let error = "ScatterJS.connect("+appname+",{this.scattNetwork}) -> connected: false ";
                    console.error('no scatter :(');
                    reject(error);
                }
            
                this.eos = <EOS>ScatterJS.eos(this.scattNetwork, Api, {rpc:this.rpc});            
                console.log("ScatterJS.eos()", this.eos);
                console.log("ScatterJS", ScatterJS);
                await this.delay(2000);
                resolve();
            });
    
        });
    }

    get network(): Network {
        return this._network;
    }

    // Acount, Identity and authentication -----------------
    resetIdentity() {
        console.log("NetworkConnexion.resetIdentity()");
        this.onLogggedStateChange.next(true);
    }
    updateAccountData() {
        console.error("NOT IMPLEMENTED");
    };

    // Networks (eosio blockchains) & Endpoints -----------------
    setEndpoints (endpoints: NetworkMap) {
        console.error("NOT IMPLEMENTED");
    };
    setNetwork(name:string) {
        console.error("NOT IMPLEMENTED");
    };
    autoSelectEndPoint (slug:string): Promise<EndpointState> {
        console.log("NetworkConnexion.autoSelectEndPoint()");
        return new Promise((resolve, reject) => {
            let promises:Promise<EndpointState>[] = [];

            // Iterate over endponits and get the first one responding
            if (this.scatter.getNetwork(slug)) {
                let endpoints: Endpoint[] = this.scatter.getNetwork(slug).endpoints;
                for (let i=0; i<endpoints.length; i++) {
                    let endpoint: Endpoint = endpoints[i];
                    promises.push(this.testEndpoint(endpoint, i));
                }
            }

            return Promise.race(promises).then(result => {
                let n = this.extractEosconfig(result.index);
                if (n) {
                    if (!this.eosconf || this.eosconf.host != n.host) {
                        this.eosconf = n;
                        // console.log("Selected Endpoint: ", this.eosconf.host);
                        // this.resetIdentity();
                        // this.initScatter();
                        this.onEndpointChange.next(this._network);
                    }
                    resolve(result);
                } else {
                    console.error("ERROR: can't resolve endpoint", result);
                }
                
            });
        });

    }
    private testEndpoint(endpoint: Endpoint, index:number = 0) {
        console.log("NetworkConnexion.testEndpoint()", endpoint.host);
        return new Promise<EndpointState>((resolve) => {
            let url = endpoint.protocol + "://" + endpoint.host + ":" + endpoint.port + "/v1/chain/get_info";
            this.http.get<GetInfoResponse>(url).toPromise().then((response) => {
                console.log("NetworkConnexion.testEndpoint()", endpoint.host, " -> ", response.chain_id);
                resolve({index, endpoint, response});
            }).catch(e => {
                console.warn("WARNING: endpoint not responding", e);
            });
        });
    }

    extractEosconfig(index: number): Eosconf {
        console.log("NetworkConnexion.extractEosconfig()", index);
        let endpoint = this.scatter.getNetwork(this.slug).endpoints[index];
        if (!endpoint) return null;
        this.eosconf = {
            blockchain: "eos",
            chainId: this.scatter.getNetwork(this.slug).chainId,
            host: endpoint.host,
            port: endpoint.port,
            protocol: endpoint.protocol,
        }
        return this.eosconf;
    }

    
    // Scatter initialization and AppConnection -----------------
    initScatter() {
        console.error("NOT IMPLEMENTED");
    };
    retryConnectingApp() {
        console.error("NOT IMPLEMENTED");
    };
    connectApp(appTitle:string = "") {
        console.error("NOT IMPLEMENTED");
        return null;
        // this.connect_count++;
        // let resolve_num = this.connect_count;
        /*
        this.feed.setLoading("connect", true);
        
        console.log(`NetworkConnexion.connectApp(${appTitle})`);
        const connectionOptions = {initTimeout:1800}
        if (this._connected) return Promise.resolve(); // <---- avoids a loop
        let promise = new Promise<any>((resolve, reject) => {
            this.waitConnected.then(resolve);
            if (this._connected) return; // <---- avoids a loop
            this.waitEosjs.then(() => {
                console.log("ScatterService.waitEosjs() eos OK");
                this.lib.connect(this.appTitle, connectionOptions).then(connected => {
                    // si está logueado this.lib.identity se carga sólo y ya está disponible
                    console.log("ScatterService.lib.connect()", connected);
                    this._connected = connected;
                    if(!connected) {
                        this.feed.setError("connect", "ERROR: can not connect to Scatter. Is it up and running?");
                        console.error(this.feed.error("connect"));
                        reject(this.feed.error("connect"));
                        this.feed.setLoading("connect", false);
                        this.retryConnectingApp();
                        return false;
                    }
                    // Get a proxy reference to eosjs which you can use to sign transactions with a user's Scatter.
                    console.log("ScatterService.setConnected()");
                    this.setConnected("connected");
                    this.feed.setLoading("connect", false);
                    if (this.logged) {
                        this.login().then(() => {
                            console.log("ScatterService.setReady()");
                            this.setReady("ready");
                        }).catch(reject);
                    } else {
                        console.log("ScatterService.setReady()");
                        this.setReady("ready");
                    }
                }).catch(e => {
                    console.error(e);
                    this.feed.setLoading("connect", false);
                    throw e;
                });    
            });    
        });
        return promise;
        */
    }
    

    // AccountData and Balances ---------------------------------
    calculateTotalBalance(account:Account): Asset {
        console.error("NOT IMPLEMENTED");
        return null;
    }
    calculateTotalStaked(account:Account): Asset {
        console.error("NOT IMPLEMENTED");
        return null;
    }

    calculateResourceLimit(limit:Limit): Limit {
        console.error("NOT IMPLEMENTED");
        return limit;
    }

    queryAccountData(name:string): Promise<AccountData> {
        console.error("NOT IMPLEMENTED");
        return new Promise<any>(() => {});
    }
    executeTransaction(contract:string, action:string, data:any): Promise<any> {
        console.error("NOT IMPLEMENTED");
        return new Promise<any>(() => {});
    }
    getContractWrapper(account_name:string): Promise<any> {
        console.error("NOT IMPLEMENTED");
        return new Promise<any>(() => {});
    }
    
    // loginTimer;
    login():Promise<any> {
        return new Promise<any>((resolve, reject) => {
            console.log("NetworkConnexion.login()", this.scattNetwork);
            ScatterJS.login({accounts:[this.scattNetwork]}).then(id => {
            // ScatterJS.login({accounts:[this.scattNetwork]}).then(id => {
                if(!id) return console.error('no identity');
                this.account = ScatterJS.account('eos');
                console.log("NetworkConnexion.login() --> ", this.account);
                resolve(this.account);
            }).catch(e => {
                // {"type":"identity_rejected","message":"User rejected the provision of an Identity","code":402,"isError":true}
                // console.error("NetworkConnexion.login() --> ", JSON.stringify(e));
                reject(e);
            });
        });
    }

    logout():Promise<any> {
        console.log("NetworkConnexion.logout()");
        ScatterJS.forgetIdentity();
        delete this.account;
        return new Promise<any>(() => {});
    }

    getTableRows(contract, scope, table, tkey, lowerb, upperb, limit, ktype, ipos, retry:boolean): Promise<any> {
        console.error("NOT IMPLEMENTED");
        return null;
    }

    isNative(thing: Asset | Token): boolean {
        console.error("NOT IMPLEMENTED");
        return false;
    }
}