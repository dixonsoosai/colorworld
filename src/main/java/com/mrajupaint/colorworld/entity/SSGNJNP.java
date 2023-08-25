package com.mrajupaint.colorworld.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "SSGNJNP")
@IdClass(SSGNJNP_KEY.class)
public class SSGNJNP
{
	@Id
	@Column
	private int gnbill;
	@Column
	private int gndate;
	@Column
	private java.sql.Timestamp gntime;
	@Column
	private String gnname;
	@Column
	private String gnpgst;
	@Id
	@Column
	private String gngstp;
	@Column
	private double gntxable;
	@Column
	private double gncamt;
	@Column
	private double gnsamt;
	@Column
	private double gntamt;
	@Column
	private String gnbltyp;
}