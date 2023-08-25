package com.mrajupaint.colorworld.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "SSCUSJP")
public class Customer
{
	@Id
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