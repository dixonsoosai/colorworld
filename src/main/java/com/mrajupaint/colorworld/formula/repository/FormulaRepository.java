package com.mrajupaint.colorworld.formula.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mrajupaint.colorworld.formula.entity.Formula;
import com.mrajupaint.colorworld.formula.entity.FormulaKey;

@Repository
public interface FormulaRepository extends JpaRepository<Formula, FormulaKey> {

	List<Formula> findByCode(String code);

}
