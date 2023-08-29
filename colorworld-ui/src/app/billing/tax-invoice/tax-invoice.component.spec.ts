import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxInvoiceComponent } from './tax-invoice.component';

describe('TaxInvoiceComponent', () => {
  let component: TaxInvoiceComponent;
  let fixture: ComponentFixture<TaxInvoiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaxInvoiceComponent]
    });
    fixture = TestBed.createComponent(TaxInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
