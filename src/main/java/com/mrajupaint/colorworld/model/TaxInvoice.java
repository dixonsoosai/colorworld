package com.mrajupaint.colorworld.model;

import java.util.List;

import com.mrajupaint.colorworld.entity.SSGNJNP;
import com.mrajupaint.colorworld.entity.SSTNHDP;
import com.mrajupaint.colorworld.entity.SSTNJNP;

import lombok.Data;

@Data
public class TaxInvoice {

	private SSTNHDP header;
	
	private List<SSTNJNP> details;
	
	private List<SSGNJNP> gst;
	
}
