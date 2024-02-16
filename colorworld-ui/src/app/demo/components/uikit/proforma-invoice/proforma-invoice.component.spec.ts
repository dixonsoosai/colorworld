import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProformaInvoiceComponent } from './proforma-invoice.component';

describe('PerfomaInvoiceComponent', () => {
  let component: ProformaInvoiceComponent;
  let fixture: ComponentFixture<ProformaInvoiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProformaInvoiceComponent]
    });
    fixture = TestBed.createComponent(ProformaInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
