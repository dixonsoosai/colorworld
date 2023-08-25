package com.mrajupaint.colorworld.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mrajupaint.colorworld.config.LogTime;
import com.mrajupaint.colorworld.model.ServiceResponse;

@RestController
public class MainController {

	@LogTime
	@GetMapping("ping")
	public ResponseEntity<ServiceResponse<String>> ping() {
		var response = new ServiceResponse<String>();
		response.setCode(HttpStatus.OK.value());
		response.setErrorMessage("");
		response.setStatus("Success");
		response.setData("Ping successful");
		return new ResponseEntity<>( response, HttpStatus.OK);
	}
}
