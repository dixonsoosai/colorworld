package com.mrajupaint.colorworld.common;

import com.mrajupaint.colorworld.exception.ColorWorldException;

public class AppConstants {

	public static final String SUCCESS = "SUCCESS";
	public static final String FAILED = "FAILED";
	public static final String VALIDATION_ERROR = "VALIDATION ERROR";
	public static final String CONTENT_DISPOSITION = "Content-Disposition";
	
	public static final String TAX_INVOICE = "T";
	
	AppConstants() throws ColorWorldException {
		throw new ColorWorldException("Not allowed to create instance");
	}
}
