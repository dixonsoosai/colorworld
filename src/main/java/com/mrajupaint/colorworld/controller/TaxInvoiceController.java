package com.mrajupaint.colorworld.controller;

import java.sql.Timestamp;
import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.util.Strings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mrajupaint.colorworld.common.AppConstants;
import com.mrajupaint.colorworld.config.LogTime;
import com.mrajupaint.colorworld.entity.SPRequest;
import com.mrajupaint.colorworld.entity.SSTNHDP;
import com.mrajupaint.colorworld.exception.ColorWorldException;
import com.mrajupaint.colorworld.model.InvoiceSummary;
import com.mrajupaint.colorworld.model.ServiceResponse;
import com.mrajupaint.colorworld.model.TaxInvoice;
import com.mrajupaint.colorworld.service.InvoiceService;

@RestController
@CrossOrigin("*")
@RequestMapping("tax-invoice")
public class TaxInvoiceController {

	private static final Logger LOGGER = LogManager.getLogger(TaxInvoiceController.class);
	
	@Autowired
	InvoiceService invoiceService;
	
	@LogTime
	@GetMapping("bills")
	public ResponseEntity<ServiceResponse<List<InvoiceSummary>>> bills(@RequestParam String billType) {
		try {
			var response = new ServiceResponse<List<InvoiceSummary>>();
			response.setCode(HttpStatus.OK.value());
			response.setErrorMessage(Strings.EMPTY);
			response.setStatus(AppConstants.SUCCESS);
			response.setData(invoiceService.getAllBills(billType));
			return new ResponseEntity<>(response, HttpStatus.OK);
		} catch (Exception e) {
			var errorResponse = new ServiceResponse<List<InvoiceSummary>>();
			errorResponse.setCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
			errorResponse.setData(null);
			errorResponse.setErrorMessage(e.getMessage());
			errorResponse.setStatus(AppConstants.FAILED);
			LOGGER.error("Exception in method: {}", e);
			return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@LogTime
	@GetMapping("refreshBilNum")
	public ResponseEntity<ServiceResponse<Integer>> refreshBilNum(@RequestParam String billDate,
			@RequestParam String billType) {
		try {
			var response = new ServiceResponse<Integer>();
			response.setCode(HttpStatus.OK.value());
			response.setErrorMessage(Strings.EMPTY);
			response.setStatus(AppConstants.SUCCESS);
			response.setData(invoiceService.refreshBillNum(Timestamp.valueOf(billDate), billType));
			return new ResponseEntity<>(response, HttpStatus.OK);
		} catch (Exception e) {
			var errorResponse = new ServiceResponse<Integer>();
			errorResponse.setCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
			errorResponse.setData(0);
			errorResponse.setErrorMessage(e.getMessage());
			errorResponse.setStatus(AppConstants.FAILED);
			LOGGER.error("Exception in method: {}", e);
			return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@LogTime
	@GetMapping("bill")
	public ResponseEntity<ServiceResponse<List<SSTNHDP>>> bill(SPRequest request) {
		try {
			var response = new ServiceResponse<List<SSTNHDP>>();
			response.setCode(HttpStatus.OK.value());
			response.setErrorMessage(Strings.EMPTY);
			response.setStatus(AppConstants.SUCCESS);
			//response.setData(accRegService.getBills(request));
			return new ResponseEntity<>(response, HttpStatus.OK);
		} catch (Exception e) {
			var errorResponse = new ServiceResponse<List<SSTNHDP>>();
			errorResponse.setCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
			errorResponse.setData(null);
			errorResponse.setErrorMessage(e.getMessage());
			errorResponse.setStatus(AppConstants.FAILED);
			LOGGER.error("Exception in method: {}", e);
			return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@LogTime
	@DeleteMapping("bill")
	public ResponseEntity<ServiceResponse<String>> bill(@RequestParam String billnum,
			@RequestParam String billType) throws ColorWorldException {
		var response = new ServiceResponse<String>();
		try {
			response.setCode(HttpStatus.OK.value());
			response.setErrorMessage(Strings.EMPTY);
			response.setStatus(AppConstants.SUCCESS);
			response.setData(invoiceService.deleteBillByInvoice(Integer.parseInt(billnum), billType));
		} catch (Exception e) {
			LOGGER.error("Error while deleting Invoice {}", e);
			response.setCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
			response.setStatus(AppConstants.FAILED);
			response.setErrorMessage(e.getMessage());
		}
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@LogTime
	@GetMapping("billDetails")
	public ResponseEntity<ServiceResponse<TaxInvoice>> billDetails(@RequestParam String billnum) {
		try {
			var response = new ServiceResponse<TaxInvoice>();
			response.setCode(HttpStatus.OK.value());
			response.setErrorMessage(Strings.EMPTY);
			response.setStatus(AppConstants.SUCCESS);
			response.setData(invoiceService.getBillDetails(billnum));
			return new ResponseEntity<>(response, HttpStatus.OK);
		} catch (Exception e) {
			var errorResponse = new ServiceResponse<TaxInvoice>();
			errorResponse.setCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
			errorResponse.setData(null);
			errorResponse.setErrorMessage(e.getMessage());
			errorResponse.setStatus(AppConstants.FAILED);
			LOGGER.error("Exception in method: {}", e);
			return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
}
