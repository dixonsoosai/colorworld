package com.mrajupaint.colorworld.service.printer;

import org.springframework.stereotype.Component;

import com.mrajupaint.colorworld.model.TaxInvoice;

@Component
public interface PrinterService {

	String printInvoice(TaxInvoice taxInvoice);
}
