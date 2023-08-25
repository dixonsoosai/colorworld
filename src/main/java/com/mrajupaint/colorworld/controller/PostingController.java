package com.mrajupaint.colorworld.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mrajupaint.colorworld.config.LogTime;
import com.mrajupaint.colorworld.exception.ColorWorldException;
import com.mrajupaint.colorworld.model.ServiceResponse;
import com.mrajupaint.colorworld.model.TaxInvoice;
import com.mrajupaint.colorworld.service.PostingService;

@RestController
@RequestMapping("posting")
public class PostingController {

	@Autowired
	PostingService postingService;
	
	@LogTime
	@PostMapping("generateBill")
	public ResponseEntity<ServiceResponse<Object>> generateBill(@RequestBody TaxInvoice taxInvoice) throws ColorWorldException {
		postingService.postBill(taxInvoice);
		return null;
	}
	
	
}
