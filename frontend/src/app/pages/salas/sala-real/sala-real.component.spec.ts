import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaRealComponent } from './sala-real.component';

describe('SalaRealComponent', () => {
  let component: SalaRealComponent;
  let fixture: ComponentFixture<SalaRealComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalaRealComponent]
    });
    fixture = TestBed.createComponent(SalaRealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
