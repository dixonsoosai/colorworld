package com.mrajupaint.colorworld.service;

import java.util.HashMap;
import java.util.List;

import org.apache.logging.log4j.util.Strings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mrajupaint.colorworld.common.AppConstants;
import com.mrajupaint.colorworld.common.AppUtils;
import com.mrajupaint.colorworld.entity.Product;
import com.mrajupaint.colorworld.exception.ColorWorldException;
import com.mrajupaint.colorworld.model.ServiceResponse;
import com.mrajupaint.colorworld.repository.ProductRepository;

@Service
public class ProductService {

	@Autowired
	ProductRepository productRepository;
	
	@Transactional(rollbackFor = Exception.class)
	@Retryable(maxAttempts = 3, backoff = @Backoff(delay = 1000))
	public ServiceResponse<Object> addProduct(Product product) {
		var response = new ServiceResponse<Object>();
		var errorMessage = new HashMap<String, String>();
		//Validation
		if(AppUtils.isBlank(product.getPncmpy())) {
			errorMessage.put("PNCMPY","Company Name cannot be blank");
		}
		if(AppUtils.isBlank(product.getPncolor())) {
			errorMessage.put("PNCOLOR","Color name cannot be blank");
		}
		if(AppUtils.isBlank(product.getPnpdcd())) {
			errorMessage.put("PNPDCD","Product Code cannot be blank");
		}
		if(AppUtils.isBlank(product.getPnscnm())) {
			errorMessage.put("PNSCNM","Color description cannot be blank");
		}
		if(!product.getPnavail().matches("^[Y|N]$")) {
			errorMessage.put("PNAVAIL","Availability can be either Y or N");
		}
		if(!errorMessage.isEmpty()) {
			response.setCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
			response.setStatus(AppConstants.FAILED);
			response.setErrorMessage(AppConstants.VALIDATION_ERROR);
			response.setData(errorMessage);
			return response;
		}
		productRepository.save(product);
		response.setCode(HttpStatus.OK.value());
		response.setStatus(AppConstants.SUCCESS);
		response.setErrorMessage(Strings.EMPTY);
		response.setData("Product saved successfully");
		return response;
	}
	
	@Transactional(rollbackFor = ColorWorldException.class)
	@Retryable(maxAttempts = 3, backoff = @Backoff(delay = 1000))
	public String deleteProduct(String productCode) throws ColorWorldException {
		int count = productRepository.deleteByPnpdcd(productCode);
		if(count > 1) {
			throw new ColorWorldException("Exception while deleting Product");
		}
		return "Product deleted successfully";
	}
	
	public Product getProduct(String productCode) {
		var product = productRepository.findById(productCode);
		if(product.isPresent()) {
			return product.get();
		}
		return null;
	}
	
	public List<Product> getAllProducts() {
		return productRepository.findAll();
	}
}
