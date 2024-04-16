package com.mrajupaint.colorworld.controller;

import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.util.Strings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mrajupaint.colorworld.common.AppConstants;
import com.mrajupaint.colorworld.config.LogTime;
import com.mrajupaint.colorworld.formula.entity.Car;
import com.mrajupaint.colorworld.formula.entity.Formula;
import com.mrajupaint.colorworld.model.ServiceResponse;
import com.mrajupaint.colorworld.service.FormulaService;

@RestController
@RequestMapping("formula")
@CrossOrigin("*")
public class FormulaController {

	private static final Logger LOGGER = LogManager.getLogger(FormulaController.class);
	
	FormulaService formulaService;
	
	public FormulaController(@Autowired FormulaService formulaService) {
		this.formulaService = formulaService;
	}
	
	
	@GetMapping("fetchAll")
	@LogTime
	public ResponseEntity<ServiceResponse<List<Car>>> fetchAll() {
		try {
			var response = new ServiceResponse<List<Car>>();
			response.setCode(HttpStatus.OK.value());
			response.setErrorMessage(Strings.EMPTY);
			response.setStatus(AppConstants.SUCCESS);
			response.setData(formulaService.getAll());
			return new ResponseEntity<>(response, HttpStatus.OK);
		} catch (Exception e) {
			var errorResponse = new ServiceResponse<List<Car>>();
			errorResponse.setCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
			errorResponse.setData(null);
			errorResponse.setErrorMessage(e.getMessage());
			errorResponse.setStatus(AppConstants.FAILED);
			LOGGER.error("Exception in method: ", e);
			return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@GetMapping("fetch")
	@LogTime
	public ResponseEntity<ServiceResponse<List<Formula>>> fetch(@RequestParam String code) {
		try {
			var response = new ServiceResponse<List<Formula>>();
			response.setCode(HttpStatus.OK.value());
			response.setErrorMessage(Strings.EMPTY);
			response.setStatus(AppConstants.SUCCESS);
			response.setData(formulaService.getFormula(code));
			return new ResponseEntity<>(response, HttpStatus.OK);
		} catch (Exception e) {
			var errorResponse = new ServiceResponse<List<Formula>>();
			errorResponse.setCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
			errorResponse.setData(null);
			errorResponse.setErrorMessage(e.getMessage());
			errorResponse.setStatus(AppConstants.FAILED);
			LOGGER.error("Exception in method: ", e);
			return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
