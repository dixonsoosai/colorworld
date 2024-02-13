package com.mrajupaint.colorworld.controller;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mrajupaint.colorworld.config.Config;
import com.mrajupaint.colorworld.config.LogTime;
import com.mrajupaint.colorworld.exception.ColorWorldException;
import com.mrajupaint.colorworld.model.TaxInvoice;
import com.mrajupaint.colorworld.service.InvoiceService;
import com.mrajupaint.colorworld.service.PostingService;

@RestController
@RequestMapping("posting")
@CrossOrigin("*")
public class PostingController {

	private static final Logger LOGGER = LogManager.getLogger(PostingController.class);
	
	@Autowired
	PostingService postingService;
	
	@Autowired
	InvoiceService invoiceService;
	
	@Autowired
	Config config;
	
	@LogTime
	@PostMapping("generateBill")
	public ResponseEntity<String> generateBill(@RequestParam(defaultValue = "17") String overflowLimit,
	@RequestBody TaxInvoice taxInvoice) throws ColorWorldException {
		try {
			config.setOverflowLimit(Integer.parseInt(overflowLimit));
			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.TEXT_HTML);
			headers.add("Content-Disposition", "attachment; filename=\"Tax Invoice.html\"");
			return new ResponseEntity<>(postingService.postBill(taxInvoice).getData(), headers, HttpStatus.OK);
		} catch (Exception e) {
			LOGGER.error("Exception in method: {}", e);
			return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@LogTime
	@PostMapping("downloadBill")
	public ResponseEntity<String> downloadBill(@RequestBody TaxInvoice taxInvoice) throws ColorWorldException {
	 	try {
			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.TEXT_HTML);
			headers.add("Content-Disposition", "attachment; filename=\"Tax Invoice.html\"");
			return new ResponseEntity<>(postingService.downloadBill(taxInvoice).getData(), headers, HttpStatus.OK);
		} catch (Exception e) {
			LOGGER.error("Exception in method: {}", e);
			return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@LogTime
	@GetMapping("downloadBillNum")
	public ResponseEntity<String> downloadBillNum(@RequestParam(defaultValue = "17") String overflowLimit,
			@RequestParam String billnum) throws ColorWorldException {
		try {
			config.setOverflowLimit(Integer.parseInt(overflowLimit));
			var taxInvoice = invoiceService.getBillDetails(billnum);
			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.TEXT_HTML);
			headers.add("Content-Disposition", "attachment; filename=\"Tax Invoice.html\"");
			return new ResponseEntity<>(postingService.downloadBill(taxInvoice).getData(), headers, HttpStatus.OK);
		} catch (Exception e) {
			LOGGER.error("Exception in method: {}", e);
			return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
}
