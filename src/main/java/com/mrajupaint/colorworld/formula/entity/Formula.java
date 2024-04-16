package com.mrajupaint.colorworld.formula.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import lombok.Data;

@Table(name = "formula")
@Entity
@IdClass(FormulaKey.class)
@Data
public class Formula {

	@Id
	@Column
	private String code;
	
	@Id
	@Column
	private String ingredients;
	
	@Column
	private double weight;
	
	@Column
	private double price;
}
