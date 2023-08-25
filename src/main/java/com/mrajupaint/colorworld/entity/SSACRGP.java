package com.mrajupaint.colorworld.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@IdClass(SSACRGP_KEY.class)
@Table(name = "SSACRGP")
public class SSACRGP
{
	@Id
	@Column
	private String arbillno;
	@Column
	private java.sql.Timestamp ardate;
	@Id
	@Column
	private String arname;
	@Column
	private String argstno;
	@Column
	private double arnamt;
	@Column
	private double arcgst;
	@Column
	private double arsgst;
	@Column
	private double artamt;
	@Column
	private String archqdte;
	@Column
	private double archqno;
	@Column
	private double archqamt;
	@Column
	private String arbname;
	@Column
	private String artext;
	@Column
	private String artype;
}
