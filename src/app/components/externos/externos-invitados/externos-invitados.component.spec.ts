import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternosInvitadosComponent } from './externos-invitados.component';

describe('ExternosInvitadosComponent', () => {
  let component: ExternosInvitadosComponent;
  let fixture: ComponentFixture<ExternosInvitadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternosInvitadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternosInvitadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
