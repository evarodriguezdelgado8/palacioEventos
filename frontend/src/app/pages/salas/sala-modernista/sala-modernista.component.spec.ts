import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaModernistaComponent } from './sala-modernista.component';

describe('SalaModernistaComponent', () => {
  let component: SalaModernistaComponent;
  let fixture: ComponentFixture<SalaModernistaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalaModernistaComponent]
    });
    fixture = TestBed.createComponent(SalaModernistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
