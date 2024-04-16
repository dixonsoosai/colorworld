package com.mrajupaint.colorworld.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mrajupaint.colorworld.formula.entity.Car;
import com.mrajupaint.colorworld.formula.entity.Formula;
import com.mrajupaint.colorworld.formula.repository.CarRepository;
import com.mrajupaint.colorworld.formula.repository.FormulaRepository;

@Service
public class FormulaService {

	CarRepository carRepository;
	
	FormulaRepository formulaRepository;
	
	public FormulaService(@Autowired CarRepository carRepository,
			@Autowired FormulaRepository formulaRepository) {
		this.carRepository = carRepository;
		this.formulaRepository = formulaRepository;
	}
	
	public List<Car> getAll() {
		return carRepository.findAll();
	}
	
	public List<Formula> getFormula(String code) {
		return formulaRepository.findByCode(code);
	}
	
}
