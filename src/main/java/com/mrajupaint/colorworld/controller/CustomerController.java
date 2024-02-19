package com.mrajupaint.colorworld.controller;

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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mrajupaint.colorworld.common.AppConstants;
import com.mrajupaint.colorworld.config.LogTime;
import com.mrajupaint.colorworld.entity.Customer;
import com.mrajupaint.colorworld.exception.ColorWorldException;
import com.mrajupaint.colorworld.model.ServiceResponse;
import com.mrajupaint.colorworld.service.CustomerService;

@RestController
@CrossOrigin
public class CustomerController {

	private static final Logger LOGGER = LogManager.getLogger(CustomerController.class);
	
	private CustomerService customerService;
	
	public CustomerController(@Autowired CustomerService customerService) {
		this.customerService = customerService;
	}
	
	@LogTime
	@GetMapping("customers")
	public ResponseEntity<ServiceResponse<List<Customer>>> getCustomers() {
		try {
			var response = new ServiceResponse<List<Customer>>();
			response.setCode(HttpStatus.OK.value());
			response.setStatus(AppConstants.SUCCESS);
			response.setErrorMessage(Strings.EMPTY);
			response.setData(customerService.getAllCustomers());
			return new ResponseEntity<>(response, HttpStatus.OK);
		} catch (Exception e) {
			var errorResponse = new ServiceResponse<List<Customer>>();
			errorResponse.setCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
			errorResponse.setData(null);
			errorResponse.setErrorMessage(e.getMessage());
			errorResponse.setStatus(AppConstants.FAILED);
			LOGGER.error("Exception in getCustomers method:", e);
			return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@LogTime
	@GetMapping("customer")
	public ResponseEntity<ServiceResponse<Customer>> getCustomer(
			@RequestParam("customerId") String customerId) {
		try {
			var response = new ServiceResponse<Customer>();
			response.setCode(HttpStatus.OK.value());
			response.setStatus(AppConstants.SUCCESS);
			response.setErrorMessage(Strings.EMPTY);
			response.setData(customerService.getCustomer(Integer.parseInt(customerId)));
			return new ResponseEntity<>(response, HttpStatus.OK);
		} catch (Exception e) {
			var errorResponse = new ServiceResponse<Customer>();
			errorResponse.setCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
			errorResponse.setData(null);
			errorResponse.setErrorMessage(e.getMessage());
			errorResponse.setStatus(AppConstants.FAILED);
			LOGGER.error("Exception in getCustomer method:", e);
			return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@LogTime
	@PutMapping("customer")
	public ResponseEntity<ServiceResponse<Object>> addCustomer(
			@RequestBody Customer customer) throws Exception {
		try {
			var response = customerService.addCustomer(customer);
			return new ResponseEntity<>(response, HttpStatus.OK);
		} catch (Exception e) {
			var errorResponse = new ServiceResponse<Object>();
			errorResponse.setCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
			errorResponse.setData(null);
			errorResponse.setErrorMessage(e.getMessage());
			errorResponse.setStatus(AppConstants.FAILED);
			LOGGER.error("Exception in addCustomer method:", e);
			return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@LogTime
	@DeleteMapping("customer")
	public ResponseEntity<ServiceResponse<String>> deleteCustomer(
			@RequestParam("customerId") String customerId) throws ColorWorldException {
		try {
			var response = new ServiceResponse<String>();
			response.setCode(HttpStatus.OK.value());
			response.setStatus("Success");
			response.setErrorMessage(Strings.EMPTY);
			response.setData(customerService.deleteCustomer(Integer.parseInt(customerId)));
			return new ResponseEntity<>(response, HttpStatus.OK);
		} catch (Exception e) {
			var errorResponse = new ServiceResponse<String>();
			errorResponse.setCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
			errorResponse.setData("Customer deletion failed");
			errorResponse.setErrorMessage(e.getMessage());
			errorResponse.setStatus(AppConstants.FAILED);
			LOGGER.error("Exception in deleteCustomer method: ", e);
			return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

}
