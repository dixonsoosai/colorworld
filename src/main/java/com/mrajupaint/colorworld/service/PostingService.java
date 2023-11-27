package com.mrajupaint.colorworld.service;

import java.sql.Timestamp;
import java.util.Objects;
import java.util.Optional;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
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
import com.mrajupaint.colorworld.repository.SSTNJNPRepository;

@Service
public class PostingService {
	
	private static final Logger LOGGER = LogManager.getLogger(PostingService.class);
	
	@Autowired
	SSTNJNPRepository sSTNJNPRepository;
	
	@Autowired
	SSGNJNPRepository sSGNJNPRepository;
	
	@Autowired
	SSTNHDPRepository sSTNHDPRepository;
	
	@Autowired
	PDFService pdfService;
	
	public ServiceResponse<String> downloadBill(TaxInvoice taxInvoice) {
		//Header should be present
		if(checkNull(taxInvoice.getHeader(), taxInvoice.getDetails(), taxInvoice.getGst())) {
			LOGGER.error("Invalid GST format, GST Detail is null");
			return new ServiceResponse<>(501, AppConstants.FAILED, "Invalid GST format",null);
		}
		
		/*
		 * GST should contain at-least 2 entries and
		 * Details should contain at-least 1 entries
		 */
		if(taxInvoice.getGst().size() < 2 || taxInvoice.getDetails().isEmpty()) {
			LOGGER.error("Invalid GST format, GST Detail missing gst entries");
			return new ServiceResponse<>(501, AppConstants.FAILED, "Invalid GST format",null);	
		}
		//Header Validation
		int billNum = taxInvoice.getHeader().getTnbillno();
		var response = validateHeader(taxInvoice.getHeader(), billNum);
		if(!response.equals("****")) {
			LOGGER.error(response);
			return new ServiceResponse<>(501, AppConstants.FAILED, response, null);
		}
		
		//GST Validation
		response = validateGST(taxInvoice, billNum);
		if(!response.equals("****")) {
			LOGGER.error(response);
			return new ServiceResponse<>(501, AppConstants.FAILED, response, null);
		}
		String buffer = pdfService.generateInvoice(taxInvoice);
		return new ServiceResponse<>(200, AppConstants.SUCCESS,"Bill generated successfully", buffer);
	}
	
	
	@Transactional(rollbackFor = ColorWorldException.class)
	@Retryable(maxAttempts = 2, backoff = @Backoff(delay = 1000))
	public ServiceResponse<String> postBill(TaxInvoice taxInvoice) throws ColorWorldException {
		
		//Header should be present
		if(checkNull(taxInvoice.getHeader(), taxInvoice.getDetails(), taxInvoice.getGst())) {
			LOGGER.error("Invalid GST format");
			return new ServiceResponse<>(501, AppConstants.FAILED, "Invalid GST format",null);
		}
		
		/*
		 * GST should contain at-least 2 entries and
		 * Details should contain at-least 1 entries
		 */
		if(taxInvoice.getGst().size() < 2 || taxInvoice.getDetails().isEmpty()) {
			LOGGER.error("Invalid GST format");
			return new ServiceResponse<>(501, AppConstants.FAILED, "Invalid GST format",null);	
		}
		int billNum = 0;
		synchronized (this) {
			//Generate Bill No
			billNum = generateBillNum(taxInvoice);
			LOGGER.info("New Bill number: {}", billNum);
			//Header Validation
			var response = validateHeader(taxInvoice.getHeader(), billNum);
			if(!response.equals("****")) {
				LOGGER.error(response);
				return new ServiceResponse<>(501, AppConstants.FAILED, 
						response, null);
			}
			
			//GST Validation
			response = validateGST(taxInvoice, billNum);
			if(!response.equals("****")) {
				LOGGER.error(response);
				return new ServiceResponse<>(501, AppConstants.FAILED, 
						response, null);
			}
		}
		try {
			sSTNJNPRepository.deleteByTnbillno(billNum);
			sSTNJNPRepository.saveAll(taxInvoice.getDetails());
			sSTNHDPRepository.save(taxInvoice.getHeader());
			sSGNJNPRepository.saveAll(taxInvoice.getGst());
			String buffer = pdfService.generateInvoice(taxInvoice);
			return new ServiceResponse<>(200, AppConstants.SUCCESS, 
					"Bill generated successfully", buffer);
		}
		catch(Exception e) {
			LOGGER.error("Error while writing exception {}", e);
			throw new ColorWorldException(e.getMessage());
		}
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
			return "Invalid Header, Company Name or Company GST not entered";
		}
		
		sstnhdp.setTnbillno(billNum);
		return "****";
	}
	
	private String validateGST(TaxInvoice taxInvoice, int billNum) {
		//Individual CGST & SGST
		double taxable = 0, cAmt = 0, sAmt = 0, tAmt = 0;
		//Total CGST & SGST
		double totalTaxable = 0, totalCGST = 0,totalSGST = 0,totalTamt = 0;
		
		var header = taxInvoice.getHeader();
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
			gst.setGnbill(billNum);
		}
		
		if(round(totalTaxable) != round(taxable) || round(totalCGST) != round(cAmt) 
				|| round(totalSGST) != round(sAmt) || round(totalTamt) != round(tAmt)) {
			LOGGER.error("Total Taxable != Sum of Taxable or Total CGST != Sum of CGST or "
					+ "Total SGST != Sum of SGST");
			LOGGER.error("{} != {} or {} != {} or {} != {}",
					totalTaxable, taxable, totalCGST, cAmt, totalSGST, sAmt, totalTamt, tAmt);
			return "Invalid GST Transaction";
		}
		
		if((round(totalTamt) != round(totalTaxable + totalCGST + totalSGST)) || 
				(round(tAmt) != round(taxable + cAmt + sAmt))) {
			LOGGER.error("Total Amount != Taxable + CGST + SGST or "
					+ "Sum of Total Amt != Sum of (Taxable + CGST + SGST)");
			LOGGER.error("{} != {} + {} + {} or {} != {} + {} + {}", 
					totalTamt, totalTaxable, totalCGST, totalSGST,
					tAmt, taxable, cAmt, sAmt);
			return "Invalid GST Total";
		}
		
		double billTaxable = 0, billCAmt = 0, billSAmt = 0, billTAmt = 0;
		
		for(int i=0; i< taxInvoice.getDetails().size(); i++) {
			var billDetails = taxInvoice.getDetails().get(i);
			billTaxable = round(billTaxable + billDetails.getTntxable());
			billCAmt = round(billCAmt + billDetails.getTncamt());
			billSAmt = round(billSAmt + billDetails.getTnsamt());
			billTAmt = round(billTAmt + billDetails.getTntamt());
			billDetails.setTnbillno(billNum);
		}
		if(round(billTaxable) != round(totalTaxable) || round(billCAmt) != round(totalCGST) || 
				round(billSAmt) != round(totalSGST) || round(header.getTntotal()) != round(billTAmt)) {
			LOGGER.info("Bill Details: Body  GST");
			LOGGER.info("Taxable: {} {}", billTaxable, totalTaxable);
			LOGGER.info("CGST: {} {}", billCAmt, totalCGST);
			LOGGER.info("SGST: {} {}", billSAmt, totalSGST);
			LOGGER.info("Total: {} {}", round(header.getTntotal()), round(billTAmt));
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
	
	public double round(double num) {
		return Math.round(num * 100.0) / 100.0;
	}
}
