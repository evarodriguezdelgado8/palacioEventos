import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaEscenicaComponent } from './sala-escenica.component';

describe('SalaEscenicaComponent', () => {
  let component: SalaEscenicaComponent;
  let fixture: ComponentFixture<SalaEscenicaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalaEscenicaComponent]
    });
    fixture = TestBed.createComponent(SalaEscenicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
