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
	private String tnchallan;
	@Column
	private String tnscnnm;
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
	private double tnprice;
	@Column
	private double tndisc;
	@Column
	private double tntxable;
	@Column
	private double tnsamt;
	@Column
	private double tncamt;
	@Column
	private double tntamt;
	
}