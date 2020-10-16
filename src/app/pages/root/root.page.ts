import { Component, OnInit, ElementRef } from '@angular/core';
import { AppService } from 'src/app/services/common/app.service';
import { LocalStringsService,  DropdownService} from 'src/app/services/common/common.services';
import { VapaeeStyle } from 'src/app/services/vapaee/style/style.service';

declare var $:any;

@Component({
    selector: 'root-page',
    templateUrl: './root.page.html',
    styleUrls: ['./root.page.scss']
})
export class RootPage implements OnInit {

    constructor(
        public app: AppService,
        public local: LocalStringsService,
        public elRef: ElementRef,

        // usados desde el html
        public dropdown: DropdownService,
        public style: VapaeeStyle,
    ) {
        
    }
    
    ngOnInit() {

    }

    collapseMenu() {
        console.log("RootPage.collapseMenu()");
        var target = this.elRef.nativeElement.querySelector("#toggle-btn");
        var navbar = this.elRef.nativeElement.querySelector("#navbar");
        if (target && $(navbar).hasClass("show")) {
            $(target).click();
        }        
    }
    

    // -----------------------------------------------

    debug(){
        //*
        // console.log("--------------------------------");
        // console.log("VPE", [this.dex]);
        // console.log("REX", [this.rex]);
        // console.log("Scatter", [this.scatter]);
        // console.log("Components", [this.components]);
        // console.log("--------------------------------");   
    }

}
