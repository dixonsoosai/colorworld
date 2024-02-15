package com.mrajupaint.colorworld.config;

import java.io.File;
import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import lombok.Data;

@Component
@Data
public class Config {

	private static final Logger LOGGER = LogManager.getLogger(Config.class);
	
	@Value("${sales.header}")
	private List<String> salesHeader;
	
	@Value("${account.registry.directory}")
	private String accountsDirectory;
	
	@Value("${account.details}")
	private String accountDetails;
	
	@Value("${tax.invoice.directory}")
	private String taxInvoiceDirectory;
	
	@Value("${company.name}")
	private String companyName;

	@Value("${company.description}")
	private String companyDescription;
	
	@Value("${company.address}")
	private String companyAddress;
	
	@Value("${company.contact}")
	private String companyContact;
	
	@Value("${overflowLimit}")
	private int overflowLimit;
	
	@Value("${company.address1}")
	private String companyAddress1;
	
	@Value("${company.address2}")
	private String companyAddress2;
	
	@Value("${company.address3}")
	private String companyAddress3;
	
	@Value("${company.mob}")
	private String companyMob;

	@Value("${company.gst}")
	private String companyGst;
	
	@PostConstruct
	private void init() {
		if(!taxInvoiceDirectory.endsWith(File.separator)) {
			taxInvoiceDirectory += File.separator;
		}
		File taxInvoice = new File(taxInvoiceDirectory);
		if(taxInvoice.mkdir()) {
			LOGGER.info("Tax Invoice Directory created");
		}
	}
	
	public int getOverflowLimit() {
		return overflowLimit;
	}

	public void setOverflowLimit(int overflowLimit) {
		this.overflowLimit = overflowLimit;
	}
	
	public void resetOverflowLimit() {
		setOverflowLimit(17);
	}
	
}
