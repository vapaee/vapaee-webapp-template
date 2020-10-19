import { NgModule } from '@angular/core';
import { VapaeeScatter2Module } from './scatter2/scatter2.module';
import { VapaeeStyleModule } from './style/style.module';

@NgModule({
  imports: [    
    VapaeeScatter2Module,
    VapaeeStyleModule
  ],
  declarations: [],
  providers: [

  ],
  exports: []
})
export class VapaeeLibsModule { }
