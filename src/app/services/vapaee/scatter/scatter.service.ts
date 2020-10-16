import { Injectable } from '@angular/core';
// import { Subject } from 'rxjs';
// import { Feedback } from '../feedback/feedback.service';
// import { ScatterUtils } from './utils.class';
// import { Asset } from './asset.class';
import { HttpClient } from '@angular/common/http';
// import { Token } from './token.class';

/*
    {
        "protocol":"https",
        "host":"telos.eos.barcelona",
        "port":443
    },
    {
        "protocol":"https",
        "host":"api.eos.miami",
        "port":443
    },
    {
        "protocol":"https",
        "host":"telos.caleos.io",
        "port":443
    }
*/

// https://github.com/GetScatter/scatter-js#user-content-want-some-quick-code
import ScatterJS from '@scatterjs/core';
import ScatterEOS from '@scatterjs/eosjs2';
import {JsonRpc, Api} from 'eosjs';

@Injectable({
    providedIn: "root"
})
export class VapaeeScatter {
    
    constructor(
        private http: HttpClient
    ) {
        console.log("VapaeeScatter()");
    }

    async connect(appname:string) {
/*

        ScatterJS.plugins( new ScatterEOS() );

        const network = ScatterJS.Network.fromJson({
            blockchain:'eos',
            chainId:'4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11',
            host:'telos.eos.barcelona',
            port:443,
            protocol:'https'
        });
        const rpc = new JsonRpc(network.fullhost());        


        ScatterJS.connect(appname, {network}).then(connected => {
            if(!connected) return console.error('no scatter');
        
            const eos = ScatterJS.eos(network, Api, {rpc});
        
            ScatterJS.login().then(id => {
                if(!id) return console.error('no identity');
                const account = ScatterJS.account('eos');
        
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
        }); 
        
        
        */
    }

}
