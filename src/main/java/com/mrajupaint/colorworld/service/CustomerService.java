package com.mrajupaint.colorworld.service;

import java.util.HashMap;
import java.util.List;

import org.apache.logging.log4j.util.Strings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mrajupaint.colorworld.common.AppConstants;
import com.mrajupaint.colorworld.entity.Customer;
import com.mrajupaint.colorworld.exception.ColorWorldException;
import com.mrajupaint.colorworld.model.ServiceResponse;
import com.mrajupaint.colorworld.repository.CustomerRepository;

@Service
public class CustomerService {

	@Autowired
	CustomerRepository customerRepository;
	
	@Transactional(rollbackFor = Exception.class)
	public ServiceResponse<Object> addCustomer(Customer customer) throws Exception {
		//Validation
		var response = new ServiceResponse<Object>();
		
		var errorMessage = new HashMap<String, String>();
		if(customer.getJpname().isBlank()) {
			errorMessage.put("JPNAME", "Customer Name cannot be blank");
		}
		if(!customer.getJpmobno().matches("^(?:\\d{10})?$")) {
			errorMessage.put("JPMOBNO", "Invalid Mob no");
		}
		if(!customer.getJppgst().matches("^(?:X{5}|[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1})$")) {
			errorMessage.put("JPPGST", "Party's GST is not in correct format");
		}
		//Add Default Date
		if(!errorMessage.isEmpty()) {
			response.setCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
			response.setErrorMessage(AppConstants.VALIDATION_ERROR);
			response.setData(errorMessage);
			return response;
		}
		
		customerRepository.save(customer);
		response.setCode(HttpStatus.OK.value());
		response.setStatus(AppConstants.SUCCESS);
		response.setErrorMessage(Strings.EMPTY);
		response.setData("Customer added successfully");
		return response;
	}
	
	@Transactional(rollbackFor = ColorWorldException.class)
	public String deleteCustomer(String customerName) throws ColorWorldException {
		int count = customerRepository.deleteByJpname(customerName);
		if(count > 1) {
			throw new ColorWorldException("Exception while deleting Customer");
		}
		return "Customer deleted successfully";
	}
	
	public Customer getCustomer(String customerName) {
		var customer = customerRepository.findById(customerName);
		if(customer.isPresent()) {
			return customer.get();
		}
		return null;
	}
	
	public List<Customer> getAllCustomers() {
		return customerRepository.findAll();
	}
}
