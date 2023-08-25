package com.mrajupaint.colorworld.entity;

import java.sql.Timestamp;

import lombok.Data;

@Data
public class SPRequest {

	private String companyName;
	private String billnum;
	private Timestamp startDate;
	private Timestamp endDate;
	
}
