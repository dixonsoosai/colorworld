package com.mrajupaint.colorworld.service;

import java.sql.Timestamp;
import java.util.Objects;
import java.util.Optional;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mrajupaint.colorworld.common.AppConstants;
import com.mrajupaint.colorworld.common.AppUtils;
import com.mrajupaint.colorworld.entity.SSTNHDP;
import com.mrajupaint.colorworld.exception.ColorWorldException;
import com.mrajupaint.colorworld.model.ServiceResponse;
import com.mrajupaint.colorworld.model.TaxInvoice;
import com.mrajupaint.colorworld.repository.SSGNJNPRepository;
import com.mrajupaint.colorworld.repository.SSTNHDPRepository;
import com.mrajupaint.colorworld.repository.TransactionRepository;

@Service
public class PostingService {
	
	private static final Logger LOGGER = LogManager.getLogger(PostingService.class);
	
	@Autowired
	TransactionRepository transactionRepository;
	
	@Autowired
	SSGNJNPRepository sSGNJNPRepository;
	
	@Autowired
	SSTNHDPRepository sSTNHDPRepository;
	
	@Autowired
	PDFService pdfService;
	
	@Transactional(rollbackFor = ColorWorldException.class)
	public ServiceResponse<Object> postBill(TaxInvoice taxInvoice) throws ColorWorldException {
		
		//Header should be present
		if(checkNull(taxInvoice.getHeader(), taxInvoice.getDetails(), taxInvoice.getGst())) {
			return new ServiceResponse<>(501, AppConstants.FAILED, "Invalid GST format",null);
		}
		
		/*
		 * GST should contain at-least 2 entries and
		 * Details should contain at-least 1 entries
		 */
		if(taxInvoice.getGst().size() < 2 || taxInvoice.getDetails().isEmpty()) {
			return new ServiceResponse<>(501, AppConstants.FAILED, "Invalid GST format",null);	
		}
		
		synchronized (this) {
			//Generate Bill No
			int billNum = generateBillNum(taxInvoice);
			LOGGER.info("New Bill number: {}", billNum);
			//Header Validation
			var response = validateHeader(taxInvoice.getHeader(), billNum);
			if(!response.equals("****")) {
				return new ServiceResponse<>(501, AppConstants.FAILED, 
						response, null);
			}
			
			//GST Validation
			response = validateGST(taxInvoice, billNum);
			if(!response.equals("****")) {
				return new ServiceResponse<>(501, AppConstants.FAILED, 
						response, null);
			}
		}
		
		pdfService.generatePDF(taxInvoice);
		
		transactionRepository.addTransaction(taxInvoice.getDetails());
		sSTNHDPRepository.save(taxInvoice.getHeader());
		sSGNJNPRepository.saveAll(taxInvoice.getGst());
		
		return new ServiceResponse<>(200, AppConstants.SUCCESS, 
				"Bill generated successfully",null);
	}

	private boolean checkNull(Object ...items) {
		for(var obj: items) {
			if(Objects.isNull(obj)) {
				return true;
			}
		}
		return false;
	}
	
	private String validateHeader(SSTNHDP sstnhdp, int billNum) {
	
		if(AppUtils.isBlank(sstnhdp.getTnname()) || AppUtils.isBlank(sstnhdp.getTnpgst())) {
			return "Invalid Header";
		}
		if(sstnhdp.getTntotal() + sstnhdp.getTnprbn() != sstnhdp.getTngdtl()) {
			return "Invalid Header Total";
		}
		if(sstnhdp.getTncsrv() != 0) {
			if(sstnhdp.getTncsrv() - sstnhdp.getTngdtl() != sstnhdp.getTnrtna()) {
				return "Calculation mismatch in Cash Received";
			}
			//Previous Balance
			if(sstnhdp.getTngdtl() != sstnhdp.getTncsrv() - sstnhdp.getTnrtna()) {
				return "Invalid Total Cash Transaction";
			}
		}
		int currentDate = Integer.parseInt(AppUtils.formatDate(sstnhdp.getTntime(), "yyyyMMdd"));
		sstnhdp.setTnblty(AppConstants.TAX_INVOICE);
		sstnhdp.setTncurdt(currentDate);
		sstnhdp.setTnbillno(billNum);
		return "****";
	}
	
	private String validateGST(TaxInvoice taxInvoice, int billNum) {
		//Individual CGST & SGST
		double taxable = 0, cAmt = 0, sAmt = 0, tAmt = 0;
		//Total CGST & SGST
		double totalTaxable = 0, totalCGST = 0,totalSGST = 0,totalTamt = 0;
		
		var header = taxInvoice.getHeader();
		int currentDate = Integer.parseInt(AppUtils.formatDate(header.getTntime(), "yyyyMMdd"));

		for(int i=0; i< taxInvoice.getGst().size(); i++) {
			var gst = taxInvoice.getGst().get(i);
			if(gst.getGngstp().equals("Total")) {
				totalTaxable = gst.getGntxable();
				totalCGST = gst.getGncamt();
				totalSGST = gst.getGnsamt();
				totalTamt = gst.getGntamt();
				
			}
			else {
				taxable += gst.getGntxable();
				cAmt += gst.getGncamt();
				sAmt += gst.getGnsamt();
				tAmt += gst.getGntamt();
			}
			gst.setGnbltyp(AppConstants.TAX_INVOICE);
			gst.setGndate(currentDate);
			gst.setGnbill(billNum);
		}
		
		if(totalTaxable != taxable || totalCGST != cAmt || totalSGST != sAmt || 
				totalTamt != tAmt) {
			return "Invalid GST Transaction";
		}
		
		if((totalTamt != totalCGST + totalSGST) || (tAmt != cAmt + sAmt)) {
			return "Invalid GST Total";
		}
		
		double billTaxable = 0, billCAmt = 0, billSAmt = 0, billTAmt = 0;
		
		for(int i=0; i< taxInvoice.getDetails().size(); i++) {
			var billDetails = taxInvoice.getDetails().get(i);
			billTaxable += billDetails.getTntxable();
			billCAmt += billDetails.getTncamt();
			billSAmt += billDetails.getTnsamt();
			billTAmt += billDetails.getTntamt();
			
			billDetails.setTnbillno(billNum);
			billDetails.setTnblty(AppConstants.TAX_INVOICE);
			billDetails.setTncurdt(currentDate);
			billDetails.setTntime(header.getTntime());
			
			billDetails.setTnrtna(header.getTnrtna());
			billDetails.setTncsrv(header.getTncsrv());
			billDetails.setTnprbn(header.getTnprbn());
			billDetails.setTntotal(header.getTntotal());
			billDetails.setTngdtl(header.getTngdtl());
		}
		if(billTaxable != totalTaxable || billCAmt != totalCGST || 
				billSAmt != totalSGST || header.getTntotal() != billTAmt) {
			return "Invalid Billing Entries";
		}
		
		return "****";
	}
	
	private int generateBillNum(TaxInvoice taxInvoice) {
		
		if(taxInvoice.getHeader().getTnbillno() != 0) {
			return taxInvoice.getHeader().getTnbillno();
		}
		Timestamp billTime = taxInvoice.getHeader().getTntime();
		Timestamp startDate = AppUtils.getStartFYear(billTime);
		Timestamp endDate = AppUtils.getEndFYear(billTime);
		Optional<Integer> bill = sSTNHDPRepository.getBillNo(startDate, endDate);
		if(bill.isPresent()) {
			return bill.get();
		} 
		else {
			return Integer.parseInt(String.valueOf(AppUtils.getFinancialYear(billTime)) + "001");
		} 
	}
}
