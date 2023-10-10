package com.mrajupaint.colorworld.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "SSTNHDP")
public class SSTNHDP
{
	@Id
	@Column
	private int tnbillno;
	@Column
	private String tnname;
	@Column
	private String tnchqdt;
	@Column
	private String tnpgst;
	@Column
	private java.sql.Timestamp tntime;
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

}