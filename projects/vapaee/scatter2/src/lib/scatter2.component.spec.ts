import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Scatter2Component } from './scatter2.component';

describe('Scatter2Component', () => {
  let component: Scatter2Component;
  let fixture: ComponentFixture<Scatter2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Scatter2Component ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Scatter2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
