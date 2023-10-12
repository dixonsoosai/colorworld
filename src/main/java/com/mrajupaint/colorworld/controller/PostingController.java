package com.mrajupaint.colorworld.controller;

import org.apache.logging.log4j.util.Strings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mrajupaint.colorworld.common.AppConstants;
import com.mrajupaint.colorworld.config.LogTime;
import com.mrajupaint.colorworld.exception.ColorWorldException;
import com.mrajupaint.colorworld.model.ServiceResponse;
import com.mrajupaint.colorworld.model.TaxInvoice;
import com.mrajupaint.colorworld.service.PostingService;

@RestController
@RequestMapping("posting")
@CrossOrigin("*")
public class PostingController {

	@Autowired
	PostingService postingService;
	
	@LogTime
	@PostMapping("generateBill")
	public ResponseEntity<ServiceResponse<String>> generateBill(@RequestBody TaxInvoice taxInvoice) throws ColorWorldException {
		postingService.postBill(taxInvoice);
		var response = new ServiceResponse<String>();
		response.setCode(HttpStatus.OK.value());
		response.setStatus(AppConstants.SUCCESS);
		response.setErrorMessage(Strings.EMPTY);
		response.setData("Invoice generated successfully");
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	
}
