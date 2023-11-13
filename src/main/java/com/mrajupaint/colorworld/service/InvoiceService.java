package com.mrajupaint.colorworld.service;

import java.sql.Timestamp;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mrajupaint.colorworld.common.AppUtils;
import com.mrajupaint.colorworld.model.InvoiceSummary;
import com.mrajupaint.colorworld.model.TaxInvoice;
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
	
	public List<InvoiceSummary> getAllBills() {
		return headerRepository.getBills(); 
	}

	public int refreshBillNum(Timestamp invoiceDate) {
		Timestamp startDate = AppUtils.getStartFYear(invoiceDate);
		Timestamp endDate = AppUtils.getEndFYear(invoiceDate);
		Optional<Integer> billnum = headerRepository.getBillNo(startDate, endDate);
		if(billnum.isEmpty()) {
			return Integer.parseInt(startDate.toLocalDateTime()
					.format(DateTimeFormatter.ofPattern("yyyyMMdd")) + "001");
		}
		else {
			return billnum.get();
		}
	}
	
	@Transactional(rollbackFor = Exception.class)
	@Retryable(maxAttempts = 3, backoff = @Backoff(delay = 1000))
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

	public TaxInvoice getBillDetails(String billnum) {
		TaxInvoice taxInvoice = new TaxInvoice();
		taxInvoice.setHeader(headerRepository.getByTnbillno(Integer.parseInt(billnum)));
		taxInvoice.setGst(gstRepository.getByGnbill(Integer.parseInt(billnum)));
		taxInvoice.setDetails(transactionRepository.getTransaction(Integer.parseInt(billnum)));
		return taxInvoice;
	}
}
