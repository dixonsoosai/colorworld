package com.mrajupaint.colorworld.controller;

import java.util.List;

import org.apache.logging.log4j.util.Strings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mrajupaint.colorworld.common.AppConstants;
import com.mrajupaint.colorworld.config.LogTime;
import com.mrajupaint.colorworld.entity.SPRequest;
import com.mrajupaint.colorworld.entity.SSACRGP;
import com.mrajupaint.colorworld.exception.ColorWorldException;
import com.mrajupaint.colorworld.model.ServiceResponse;
import com.mrajupaint.colorworld.service.AccountRegisterService;

@RestController
@CrossOrigin
@RequestMapping("sale-purchase")
public class AccountRegisterController {

	@Autowired
	AccountRegisterService accRegService;
	
	@LogTime
	@GetMapping("bills")
	public ResponseEntity<ServiceResponse<List<SSACRGP>>> bills() {
		var response = new ServiceResponse<List<SSACRGP>>();
		response.setCode(HttpStatus.OK.value());
		response.setErrorMessage(Strings.EMPTY);
		response.setStatus(AppConstants.SUCCESS);
		response.setData(accRegService.getAllBills());
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@LogTime
	@GetMapping("bill")
	public ResponseEntity<ServiceResponse<List<SSACRGP>>> bill(SPRequest request) {
		var response = new ServiceResponse<List<SSACRGP>>();
		response.setCode(HttpStatus.OK.value());
		response.setErrorMessage(Strings.EMPTY);
		response.setStatus(AppConstants.SUCCESS);
		response.setData(accRegService.getBills(request));
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@LogTime
	@PutMapping("bill")
	public ResponseEntity<ServiceResponse<Object>> bill(@RequestBody SSACRGP request) {
		var response = new ServiceResponse<Object>();
		response.setCode(HttpStatus.OK.value());
		response.setErrorMessage(Strings.EMPTY);
		response.setStatus(AppConstants.SUCCESS);
		response.setData(accRegService.addBillDetails(request));
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@LogTime
	@DeleteMapping("bill")
	public ResponseEntity<ServiceResponse<String>> bill(@RequestParam String billnum) throws ColorWorldException {
		var response = new ServiceResponse<String>();
		response.setCode(HttpStatus.OK.value());
		response.setErrorMessage(Strings.EMPTY);
		response.setStatus(AppConstants.SUCCESS);
		response.setData(accRegService.deleteBillByBillNo(billnum));
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@LogTime
	@PostMapping("download/accounts")
	public ResponseEntity<Resource> downloadAccount(@RequestBody SPRequest request) {
		  return ResponseEntity.ok()
	                .contentType(MediaType.APPLICATION_OCTET_STREAM)
	                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"Sales_Purchase History.xlsx\"")
	                .body(accRegService.downloadBills(request));  
	}
	
}
