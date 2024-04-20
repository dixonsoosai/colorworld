package com.formula.colorworld.controller;

import java.util.List;

import org.apache.logging.log4j.util.Strings;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.formula.colorworld.common.AppConstants;
import com.formula.colorworld.config.LogTime;
import com.formula.colorworld.entity.Car;
import com.formula.colorworld.entity.Formula;
import com.formula.colorworld.model.ServiceResponse;
import com.formula.colorworld.service.FormulaService;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@CrossOrigin("*")
@Slf4j
@AllArgsConstructor
public class FormulaController {

	FormulaService formulaService;
	
	
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
			log.error("Exception in method: ", e);
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
			log.error("Exception in method: ", e);
			return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
