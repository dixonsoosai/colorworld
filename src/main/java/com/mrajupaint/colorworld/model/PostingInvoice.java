package com.mrajupaint.colorworld.model;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class PostingInvoice extends TaxInvoice {

	@Data
	class BillParams {
		private int overflowLimit = 17;
		private String preview = "";
	}
	private BillParams billParams; 
}

