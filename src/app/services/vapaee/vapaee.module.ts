import { NgModule } from '@angular/core';
import { VapaeeScatterModule } from './scatter/scatter.module';
import { VapaeeStyleModule } from './style/style.module';

@NgModule({
  imports: [    
    VapaeeScatterModule,
    VapaeeStyleModule
  ],
  declarations: [],
  providers: [

  ],
  exports: []
})
export class VapaeeModule { }
