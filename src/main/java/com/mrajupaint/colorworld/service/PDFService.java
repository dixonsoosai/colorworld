package com.mrajupaint.colorworld.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import com.mrajupaint.colorworld.model.TaxInvoice;
import com.mrajupaint.colorworld.repository.SSGNJNPRepository;
import com.mrajupaint.colorworld.repository.SSTNHDPRepository;
import com.mrajupaint.colorworld.repository.TransactionRepository;
import com.mrajupaint.colorworld.service.printer.PrinterService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PDFService {
	
	private final SSTNHDPRepository headerRepository;
	
	private final TransactionRepository transactionRepository;
	
	private final SSGNJNPRepository gstRepository;
	
	@Autowired
	@Qualifier("TaxInvoiceService")
	private PrinterService taxInvoiceService;
	
	@Autowired
	@Qualifier("TaxInvoice2Service")
	private PrinterService taxInvoice2Service;
	
	@Autowired
	@Qualifier("QuotationService")
	private PrinterService quotationService;
	
	
	public String generateInvoice(int billnum, String billType) {
		var invoice = new TaxInvoice();
		invoice.setHeader(headerRepository.getByTnbillnoAndTnbilltype(billnum, billType));
		invoice.setGst(gstRepository.getByGnbillAndGnbilltype(billnum, billType));
		invoice.setDetails(transactionRepository.getTransaction(billnum, billType));
		return generateInvoice(invoice);
	}
	
	public String generateInvoice(TaxInvoice invoice) {
		PrinterService printerService;
		switch(invoice.getHeader().getTnbilltype()) {
			case "T":
			case "P":
			case "CM":
				printerService = taxInvoice2Service;
				break;
			default:
				printerService = quotationService;
				break;
		}
		
		return printerService.printInvoice(invoice);
	}
}
