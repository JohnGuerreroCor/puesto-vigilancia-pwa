import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternosVisitantesComponent } from './externos-visitantes.component';

describe('ExternosVisitantesComponent', () => {
  let component: ExternosVisitantesComponent;
  let fixture: ComponentFixture<ExternosVisitantesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternosVisitantesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternosVisitantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
