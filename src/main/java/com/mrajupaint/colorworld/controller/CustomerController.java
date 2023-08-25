package com.mrajupaint.colorworld.controller;

import java.util.List;

import org.apache.logging.log4j.util.Strings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
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

	@Autowired
	private CustomerService customerService;
	
	@LogTime
	@GetMapping("customers")
	public ResponseEntity<ServiceResponse<List<Customer>>> getCustomers() {
		var response = new ServiceResponse<List<Customer>>();
		response.setCode(HttpStatus.OK.value());
		response.setStatus(AppConstants.SUCCESS);
		response.setErrorMessage(Strings.EMPTY);
		response.setData(customerService.getAllCustomers());
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@LogTime
	@GetMapping("customer/{customerName}")
	public ResponseEntity<ServiceResponse<Customer>> getCustomer(@PathVariable String customerName) {
		var response = new ServiceResponse<Customer>();
		response.setCode(HttpStatus.OK.value());
		response.setStatus(AppConstants.SUCCESS);
		response.setErrorMessage(Strings.EMPTY);
		response.setData(customerService.getCustomer(customerName));
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@LogTime
	@PutMapping("customer")
	public ResponseEntity<ServiceResponse<Object>> addCustomer(@RequestBody Customer customer) throws Exception {
		var response = customerService.addCustomer(customer);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@LogTime
	@DeleteMapping("customer")
	public ResponseEntity<ServiceResponse<String>> deleteCustomer(@RequestBody String customerName) throws ColorWorldException {
		var response = new ServiceResponse<String>();
		response.setCode(HttpStatus.OK.value());
		response.setStatus("Success");
		response.setErrorMessage(Strings.EMPTY);
		response.setData(customerService.deleteCustomer(customerName));
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

}
