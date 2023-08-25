package com.mrajupaint.colorworld.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "SSTNJNP")
@IdClass(SSTNJNP_KEY.class)
public class SSTNJNP
{
	@Id
	@Column
	private int tnbillno;
	@Column
	private int tncurdt;
	@Column
	private java.sql.Timestamp tntime;
	@Column
	private String tnname;
	@Column
	private String tnchqdt;
	@Column
	private String tnchallan;
	@Column
	private String tncmpy;
	@Column
	private String tncmpd;
	@Column
	private String tncolor;
	@Column
	private String tnscnnm;
	@Column
	private double tnprice;
	@Column
	private double tntxable;
	@Column
	private double tnsamt;
	@Column
	private double tncamt;
	@Column
	private double tntamt;
	@Column
	private double tntqty;
	@Column
	private double tnuqty;
	@Column
	private String tnunit;
	
	@Id
	@Column
	private String tnpdcd;
	@Column
	private int tnhsnc;
	@Column
	private double tncgst;
	@Column
	private double tnsgst;
	@Column
	private double tnmrp;
	@Column
	private double tncuspr;
	@Column
	private double tnmcpr;
	@Column
	private double tnspcpr;
	@Column
	private double tngstpr;
	@Column
	private double tntotal;
	@Column
	private double tnprbn;
	@Column
	private double tngdtl;
	@Column
	private double tncsrv;
	@Column
	private double tnrtna;
	@Column
	private String tnblty;
}