package com.mrajupaint.colorworld.service;

import java.util.List;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mrajupaint.colorworld.entity.SSTNHDP;
import com.mrajupaint.colorworld.repository.SSGNJNPRepository;
import com.mrajupaint.colorworld.repository.SSTNHDPRepository;
import com.mrajupaint.colorworld.repository.TransactionRepository;

@Service
public class InvoiceService {

	private static final Logger LOGGER = LogManager.getLogger(InvoiceService.class);
	
	@Autowired
	SSTNHDPRepository headerRepository;
	
	@Autowired
	SSGNJNPRepository gstRepository;
	
	@Autowired
	TransactionRepository transactionRepository;
	
	public List<SSTNHDP> getAllBills() {
		return headerRepository.findAll(); 
	}
	
	@Transactional(rollbackFor = Exception.class)
	public String deleteBillByInvoice(int billnum) throws Exception {
		int count = headerRepository.deleteByTnbillno(billnum);
		if(count > 1) {
			throw new Exception("Delete count greater than 1 " + count);
		}
		LOGGER.info("Delete from SSTNHDP");
		int gstcount = gstRepository.deleteAllByGnbill(billnum);
		if(gstcount >= 5) {
			throw new Exception("Delete count greater than 1 " + count);
		}
		LOGGER.info("Delete from SSGNJNP");
		transactionRepository.deleteInvoice(billnum);
		LOGGER.info("Delete from SSTNJNP");
		return "Bill deleted successfully";
	}
}
