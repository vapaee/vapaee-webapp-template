import { NgModule } from '@angular/core';

/* Angular Material modules */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPseudoCheckboxModule, MatCommonModule, MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSidenavModule } from '@angular/material/sidenav';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';


@NgModule({
    declarations: [],
    entryComponents: [],
    imports: [
        BrowserAnimationsModule,
        MatButtonModule,
        MatCommonModule,
        MatPseudoCheckboxModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatOptionModule,
        MatDialogModule,
        MatRippleModule,
        MatSelectModule,
        MatInputModule,
        MatIconModule,
        MatBadgeModule,
        MatChipsModule,
        MatProgressBarModule,
        MatSidenavModule,
        LayoutModule,
        MatListModule,
        MatToolbarModule
    ],
    providers: [
    ],
    bootstrap: [],
    exports: [
        BrowserAnimationsModule,
        MatButtonModule,
        MatCommonModule,
        MatPseudoCheckboxModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatOptionModule,
        MatDialogModule,
        MatRippleModule,
        MatSelectModule,
        MatInputModule,
        MatIconModule,
        MatBadgeModule,
        MatChipsModule,
        MatProgressBarModule,
        MatSidenavModule,
        LayoutModule,
        MatListModule,
        MatToolbarModule
    ]
})
export class AngularMaterialModule {}
