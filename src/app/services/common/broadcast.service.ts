import { Injectable } from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

/*
This is a Singletón entoty who centers global events.
So any component can handle any global event or trigger a global event without having to need a reference to eachother.
*/

interface BroadcastEvent {
    key: any;
    data?: any;
}

@Injectable()
export class BroadcastService {
    private _eventBus: Subject<BroadcastEvent>;

    constructor() {
        this._eventBus = new Subject<BroadcastEvent>();
    }

    broadcast(key: string, data?: any) {
        this._eventBus.next({key, data});
    }

    on<T>(key: string): Observable<T> {
        return this._eventBus.asObservable()
        .filter(event => event.key === key)
        .map(event => <T>event.data);
    }    
}
