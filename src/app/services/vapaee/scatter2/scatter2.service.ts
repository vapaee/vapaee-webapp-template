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
import { NetworkConnexion } from './connexion.class';

export interface VapaeeScatterInterface {
    createConnextion: (appname:string, net_slug:string)=> Promise<VapaeeScatterConnexion>;
    getNetwork: (slug: string) => Network;
}
export interface ConnexionMap {
    [key:string]:VapaeeScatterConnexion
};

@Injectable({
    providedIn: "root"
})
export class VapaeeScatter2 implements VapaeeScatterInterface /*, VapaeeScatterConnexion */ {
    
    public appname: string;
    public net: ConnexionMap = {};
    private _networks: NetworkMap = {};
    private _networks_slugs: string[] = [];

    private setEndpointsReady: Function;
    public waitEndpoints: Promise<any> = new Promise((resolve) => {
        this.setEndpointsReady = resolve;
    });

    constructor(
        private http: HttpClient
    ) {
        
        console.log("VapaeeScatter2()");
    }

    get networks(){
        return this._networks_slugs;
    }

    getNetwork(slug: string): Network {
        return this._networks[slug];
    }

    async init(path:string) {
        // init es llamado por la app donde además le pasan el parámetro de config de donde tomar los endpoints.
        // este hace un setEndpoints(...)
        // 
        let endpoints = await this.fetchEndpoints(path);
        this.setEndpoints(endpoints);
    }

    private async fetchEndpoints(url:string): Promise<NetworkMap> {
        return this.http.get<NetworkMap>(url).toPromise().then((response) => {
            console.log("ScatterService.fetchEndpoints()", response);
            return response;
        }).catch(e => {
            console.warn("WARNING: endpoint not responding", e);
            throw e;
        });
    }

    private setEndpoints(endpoints: NetworkMap) {
        console.log("ScatterService.setEndpoints()", [endpoints]);
        this._networks = endpoints || this._networks;
        for (let slug in this._networks) {
            this._networks_slugs.push(slug);
            this.net[slug] = new NetworkConnexion(this, slug, this.http);
        }
        this.setEndpointsReady();
    }

    async createConnextion(appname:string, slug:string): Promise<VapaeeScatterConnexion> {
        this.appname = appname;
        return new Promise<VapaeeScatterConnexion>(async (resolve, reject) => {
            await this.setEndpointsReady;
            let connexion = this.net[slug] = this.net[slug] || new NetworkConnexion(this, slug, this.http);
            await connexion.autoSelectEndPoint(slug);
            await connexion.connect(this.appname);
            resolve(connexion);
        });
    };


    

    // esto es de prueba temporal ----------------
    async connect(appname:string, net_slug:string) {
        console.log(" ---- VapaeeScatter2.connect() ----");
        this.appname = appname;

        ScatterJS.plugins( new ScatterEOS() );

        const network = ScatterJS.Network.fromJson({
            blockchain:'eos',
            chainId:'4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11',
            host:'telos.eos.barcelona',
            port:443,
            protocol:'https'
        });
        const rpc = new JsonRpc(network.fullhost());        

        console.log("network",network);
        console.log("rpc",rpc);
        console.log("ScatterJS",ScatterJS);


        ScatterJS.connect(appname, {network}).then(connected => {
            if(!connected) return console.error('no scatter :(');
        
            const eos = ScatterJS.eos(network, Api, {rpc});
            
            console.log("eos",eos);
            setTimeout(() => {
                ScatterJS.login().then(id => {
                    if(!id) return console.error('no identity');
                    const account:Account = ScatterJS.account('eos');
            
                    eos.transact({
                        actions: [{
                            account: 'eosio.token',
                            name: 'transfer',
                            authorization: [{
                                actor: account.name,
                                permission: account.authority,
                            }],
                            data: {
                                from: account.name,
                                to: 'cardsntokens',
                                quantity: '0.0001 ACORN',
                                memo: account.name,
                            },
                        }]
                    }, {
                        blocksBehind: 3,
                        expireSeconds: 30,
                    }).then(res => {
                        console.log('sent: ', res);
                    }).catch(err => {
                        console.error('error: ', err);
                    });
                });    
            }, 2500);
        }); 
    }

}

export interface EOS {
    contracts: Function;
    cachedAbis: Function;
    rpc: Function;
    authorityProvider: Function;
    abiProvider: Function;
    signatureProvider: Function;
    chainId: Function;
    textEncoder: Function;
    textDecoder: Function;
    abiTypes: Function;
    transactionTypes: Function;
    rawAbiToJson: Function;
    getCachedAbi: Function;
    getAbi: Function;
    getTransactionAbis: Function;
    getContract: Function;
    serialize: Function;
    deserialize: Function;
    serializeTransaction: Function;
    deserializeTransaction: Function;
    serializeActions: Function;
    deserializeActions: Function;
    deserializeTransactionWithActions: Function;
    transact: Function;
    pushSignedTransaction: Function;
    hasRequiredTaposFields: Function;    
}

export interface Scatter {
    identity: any,
    eosHook: Function;
    eos?:Function,
    network: any;
    // -----------------    
    forgotten?:boolean, // was forgetIdentity executed?    
    isExtension: boolean,
    // -----------------
    authenticate: Function,
    connect: Function,
    constructor: Function,
    createTransaction: Function,
    disconnect: Function,
    forgetIdentity: Function,
    getArbitrarySignature: Function,
    getIdentity: Function,
    getIdentityFromPermissions: Function,
    getPublicKey: Function,
    getVersion: Function,
    hasAccountFor: Function,
    isConnected: Function,
    isPaired: Function,
    linkAccount: Function,
    loadPlugin: Function,
    requestSignature: Function,
    requestTransfer: Function,
    suggestNetwork: Function
}

export interface AccountData {
    account_name?: string,
    head_block_num?: number,
    head_block_time?: string,
    privileged?: false,
    last_code_update?: string,
    created?: string,
    core_liquid_balance?: string,
    core_liquid_balance_asset?: Asset,
    ram_quota?: number,
    net_weight?: number,
    cpu_weight?: number,
    total_balance: string,
    total_balance_asset: Asset,
    total_staked: string,
    total_staked_asset: Asset,
    ram_limit?: {
        percentStr?: string,
        used?: number,
        available?: number,
        max?: number
    },
    net_limit?: {
        percentStr?: string,
        used?: number,
        available?: number,
        max?: number
    },
    cpu_limit?: {
        percentStr?: string,
        used?: number,
        available?: number,
        max?: number
    },
    ram_usage?: number,
    permissions?: {
        perm_name?: string,
        parent?: string,
        required_auth?: {
            threshold?: 1,
            keys?: {
                key?: string,
                weight?: 1
            }[],
            accounts?: any[],
            waits?: any[]
        }
    }[],
    total_resources?: {
        owner?: string,
        net_weight?: string,
        net_weight_asset?: Asset,
        cpu_weight?: string,
        cpu_weight_asset?: Asset,
        ram_bytes?: number
    },
    self_delegated_bandwidth?: {
        from?: string,
        to?: string,
        total?: string,
        total_asset?: Asset,
        net_weight?: string,
        net_weight_asset?: Asset,
        cpu_weight?: string,
        cpu_weight_asset?: Asset,
    },
    refund_request?: {
        owner?: string,
        request_time?: string,
        total?: string,
        total_asset?: Asset,
        net_amount?: string,
        net_amount_asset?: Asset,
        cpu_amount?: string,
        cpu_amount_asset?: Asset
    },
    voter_info?: {
        owner?: string,
        proxy?: string,
        producers?: string[],
        staked?: number,
        last_vote_weight?: string,
        proxied_vote_weight?: string,
        is_proxy?: number
    },
    returnedFields?: null
}

export interface Account {
    authority?: string,
    blockchain?: string,
    name: string,
    publicKey?: string,
    data?: AccountData
}

export interface Endpoint {
    protocol:string,
    host:string,
    port:number
}

export interface Eosconf {
    blockchain:string,
    protocol:string,
    host:string,
    port:number,
    chainId:string
}

export interface Network {
    slug?: string,
    // index?: number,
    // eosconf?: Eosconf,
    explorer?: string,
    symbol: string,
    name: string,
    chainId:string,
    endpoints: Endpoint[]
}

export interface NetworkMap {
    [key:string]:Network
};

export interface ScatterJSDef {
    plugins?:any,
    scatter?:any
}

export interface GetInfoResponse {
    block_cpu_limit: number;
    block_net_limit: number;
    chain_id: string;
    fork_db_head_block_id: string;
    fork_db_head_block_num: number;
    head_block_id: string;
    head_block_num: number;
    head_block_producer: string;
    head_block_time: string;
    last_irreversible_block_id: string;
    last_irreversible_block_num: number;
    server_version: string;
    server_version_string: string;
    virtual_block_cpu_limit: number;
    virtual_block_net_limit: number;
}

export interface EndpointState {
    index?:number;
    endpoint: Endpoint;
    response: GetInfoResponse;
}

export interface Limit {
    percent:number;
    max:number;
    used: number;
    percentStr:string;
}

export interface VapaeeScatterConnexion {
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

    // Connexion ------------------------------------------
    connect(appname:string): Promise<any>;

    // Acount, Identity and authentication -----------------
    resetIdentity: () => void;
    updateAccountData: () => void;

    // Networks (eosio blockchains) & Endpoints -----------------
    setEndpoints: (endpoints: NetworkMap) => void;
    setNetwork: (name:string) => void;
    autoSelectEndPoint: (slug:string) => Promise<EndpointState>;
    

    networks: string[];
    network: Network;
    slug: string;

    
    // Scatter initialization and AppConnection -----------------
    initScatter: () => void;
    retryConnectingApp: () => void;
    connectApp: (appTitle:string) => Promise<any>;
    

    // AccountData and Balances ---------------------------------
    calculateTotalBalance: (account:Account) => Asset;
    calculateTotalStaked: (account:Account) => Asset;

    calculateResourceLimit(limit:Limit): Limit;

    queryAccountData: (name:string) => Promise<AccountData>;
    executeTransaction: (contract:string, action:string, data:any) => Promise<any>;
    getContractWrapper: (account_name:string) => Promise<any>;
    
    // loginTimer;
    login:() => Promise<any>;
    logout:() => Promise<any>;

    logged: boolean;
    username: string;
    authorization: {authorization:string[]};
    connected: boolean;

    getTableRows: (contract, scope, table, tkey, lowerb, upperb, limit, ktype, ipos, retry:boolean) => Promise<any>;
    isNative: (thing: Asset | Token) => boolean;
}
