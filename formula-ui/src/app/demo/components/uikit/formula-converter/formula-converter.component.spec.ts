import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaConverterComponent } from './formula-converter.component';

describe('FormulaConverterComponent', () => {
  let component: FormulaConverterComponent;
  let fixture: ComponentFixture<FormulaConverterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormulaConverterComponent]
    });
    fixture = TestBed.createComponent(FormulaConverterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
