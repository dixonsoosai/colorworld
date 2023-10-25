package com.mrajupaint.colorworld.model;

public interface InvoiceSummary {

	int getTnbillno();
	String getTnname();
	String getTnpgst();
	java.sql.Timestamp getTntime();
	String getGngstp();
	double getGntxable();
	double getGncamt();
	double getGnsamt();
	double getGntamt();

}
