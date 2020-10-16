import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HomePage } from './home/home.page';
import { ComingSoonPage } from './coming-soon/coming-soon.page';
import { NotFoundPage } from './not-found/not-found.page';
import { RootPage } from './root/root.page';


@NgModule({
    declarations: [
        RootPage,
        HomePage,
        ComingSoonPage,
        NotFoundPage
    ],
    imports: [
        BrowserModule,
        FormsModule
    ],
    providers: [
        
    ],
    exports: [
        RootPage,
        HomePage,
        ComingSoonPage,
        NotFoundPage
    ]
})
export class PagesModule { }
