import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaJardinComponent } from './sala-jardin.component';

describe('SalaJardinComponent', () => {
  let component: SalaJardinComponent;
  let fixture: ComponentFixture<SalaJardinComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalaJardinComponent]
    });
    fixture = TestBed.createComponent(SalaJardinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
