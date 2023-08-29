package com.mrajupaint.colorworld.controller;

import java.util.List;

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
import com.mrajupaint.colorworld.entity.Product;
import com.mrajupaint.colorworld.exception.ColorWorldException;
import com.mrajupaint.colorworld.model.ServiceResponse;
import com.mrajupaint.colorworld.service.ProductService;

@RestController
@CrossOrigin
public class ProductController {

	@Autowired
	private ProductService productService;
	
	@LogTime
	@GetMapping("products")
	public ResponseEntity<ServiceResponse<List<Product>>> products() {
		var response = new ServiceResponse<List<Product>>();
		response.setCode(HttpStatus.OK.value());
		response.setStatus(AppConstants.SUCCESS);
		response.setErrorMessage(Strings.EMPTY);
		response.setData(productService.getAllProducts());
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@LogTime
	@GetMapping("product")
	public ResponseEntity<ServiceResponse<Product>> product(
			@RequestParam("productCode") String productCode) {
		var response = new ServiceResponse<Product>();
		response.setCode(HttpStatus.OK.value());
		response.setStatus(AppConstants.SUCCESS);
		response.setErrorMessage(Strings.EMPTY);
		response.setData(productService.getProduct(productCode));
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@LogTime
	@PutMapping("product")
	public ResponseEntity<ServiceResponse<Object>> addProduct(@RequestBody Product product) {
		var response = productService.addProduct(product);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@LogTime
	@DeleteMapping("product")
	public ResponseEntity<ServiceResponse<String>> deleteProduct(
			@RequestParam("productCode") String productCode) throws ColorWorldException {
		var response = new ServiceResponse<String>();
		response.setCode(HttpStatus.OK.value());
		response.setStatus("Success");
		response.setErrorMessage(Strings.EMPTY);
		response.setData(productService.deleteProduct(productCode));
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
}
