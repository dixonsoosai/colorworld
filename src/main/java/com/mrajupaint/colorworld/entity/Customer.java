package com.mrajupaint.colorworld.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "SSCUSJP")
public class Customer
{
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column
	private int jpid;
	
	@Column
	private String jpname;
	
	@Column
	private String jpmobno;
	
	@Column
	private String jppgst;
	
	@Column
	private double jpbaln;
	
	@Column
	private String jpdate;
}