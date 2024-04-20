package com.formula.colorworld.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.formula.colorworld.entity.Formula;
import com.formula.colorworld.entity.FormulaKey;

@Repository
public interface FormulaRepository extends JpaRepository<Formula, FormulaKey> {

	List<Formula> findByCode(String code);

}
