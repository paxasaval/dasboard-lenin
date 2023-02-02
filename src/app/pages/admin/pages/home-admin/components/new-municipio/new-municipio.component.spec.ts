import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMunicipioComponent } from './new-municipio.component';

describe('NewMunicipioComponent', () => {
  let component: NewMunicipioComponent;
  let fixture: ComponentFixture<NewMunicipioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewMunicipioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewMunicipioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
