import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EscanerComponent } from './escaner.component';

describe('EscanerComponent', () => {
  let component: EscanerComponent;
  let fixture: ComponentFixture<EscanerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EscanerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EscanerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
