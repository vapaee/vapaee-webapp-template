import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AppService } from 'src/app/services/common/app.service';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { VapaeeScatter } from 'src/app/services/vapaee/scatter/scatter.service';



@Component({
    selector: 'home-page',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss', '../common.page.scss']
})
export class HomePage implements OnInit, OnDestroy {
   
    timer: number;
    constructor(
        public app: AppService,
        public local: LocalStringsService,
        public scatter: VapaeeScatter
    ) {
        /// this.scatter.connect(
    }

    ngOnInit() {
    } 

    ngOnDestroy() {
        
    }
}
