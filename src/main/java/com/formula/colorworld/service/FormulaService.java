package com.formula.colorworld.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.formula.colorworld.entity.Car;
import com.formula.colorworld.entity.Formula;
import com.formula.colorworld.repository.CarRepository;
import com.formula.colorworld.repository.FormulaRepository;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class FormulaService {

	private final CarRepository carRepository;
	
	private final FormulaRepository formulaRepository;
	
	List<Car> formulaList = new ArrayList<>();
	
	@PostConstruct
	public void init() {
		getAll();
		log.info("Memoized all formula list: {} ", formulaList.size());
	}
	
	public List<Car> getAll() {
		if(formulaList.isEmpty()) {
			formulaList.addAll(carRepository.findAll());
		}
		return formulaList;
	}
	
	public List<Formula> getFormula(String code) {
		return formulaRepository.findByCode(code);
	}
	
}
