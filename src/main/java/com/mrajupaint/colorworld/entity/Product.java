package com.mrajupaint.colorworld.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

@Entity
@Table(name="SSPNMSP")
@Data
public class Product {

	@Column(name = "PNCMPY")
	private String pncmpy;
	
	@Column(name = "PNCMPD")
	private String pncmpd;
	
	@Column(name = "PNCOLOR")
	private String pncolor;
	
	@Column(name = "PNSCNNM")
	private String pnscnm;
	
	@Id
	@Column(name = "PNPDCD")
	private String pnpdcd; 
	
	@Column(name = "PNHSNC")
	private String pnhsnc;
	
	@Column(name = "PNCGST")
	private double pncgst;
	
	@Column(name = "PNSGST")
	private double pnsgst;
	
	@Column(name = "PNUQTY")
	private int pnuqty;
	
	@Column(name = "PNUNIT")
	@Pattern(regexp = "^(kg|ml|L|gm|nos)$")
	private String pnunit;
	
	@Column(name = "PNMRP")
	private double pnmrp;
	
	@Column(name = "PNCUSPR")
	private double pncuspr;
	
	@Column(name = "PNMCPR")
	private double pnmcpr;
	
	@Column(name = "PNSPCPR")
	private double pnspcpr;
	
	@Column(name = "PNGSTPR")
	private double pngstpr;
	
	@PositiveOrZero
	@Column(name = "PNIOSTK")
	private int pniostk;
	
	@Pattern(regexp = "^[YN]$", message = "Availability should be either Y or N")
	@Column(name = "PNAVAIL")
	private String pnavail;
	
}
