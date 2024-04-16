package com.mrajupaint.colorworld.formula.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Table(name = "product")
@Entity
@Data
public class Car {

	
	@Id
	@Column
	private String code;
	
	@Column
	private String brand;
	
	@Column
	private String model;
	
	@Column
	private String shade;
	
	@Column
	private String variant;
	
}
