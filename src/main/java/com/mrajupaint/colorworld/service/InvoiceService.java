package com.mrajupaint.colorworld.service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.locks.ReentrantReadWriteLock;

import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mrajupaint.colorworld.common.AppUtils;
import com.mrajupaint.colorworld.config.LogTime;
import com.mrajupaint.colorworld.exception.ColorWorldException;
import com.mrajupaint.colorworld.model.InvoiceSummary;
import com.mrajupaint.colorworld.model.TaxInvoice;
import com.mrajupaint.colorworld.repository.SSGNJNPRepository;
import com.mrajupaint.colorworld.repository.SSTNHDPRepository;
import com.mrajupaint.colorworld.repository.TransactionRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class InvoiceService {

	private final SSTNHDPRepository headerRepository;
	
	private final SSGNJNPRepository gstRepository;
	
	private final TransactionRepository transactionRepository;
	
	private final ReentrantReadWriteLock rwLock = new ReentrantReadWriteLock();
	private volatile List<InvoiceSummary> invoiceSummary = Collections.emptyList();

	@Async
    @LogTime
    public void refreshInvoiceSummary() {
        rwLock.writeLock().lock();
        try {
            invoiceSummary = Collections.unmodifiableList(
                new ArrayList<>(headerRepository.getInvoiceBills())
            );
        } finally {
            rwLock.writeLock().unlock();
        }
    }

    @LogTime
    private void forceRefreshInvoiceSummary() {
        rwLock.writeLock().lock();
        try {
            invoiceSummary = Collections.unmodifiableList(
                new ArrayList<>(headerRepository.getInvoiceBills())
            );
        } finally {
            rwLock.writeLock().unlock();
        }
    }

    public List<InvoiceSummary> getInvoiceBills() {
        rwLock.readLock().lock();
        try {
            if (invoiceSummary.isEmpty()) {
                // must release read lock before doing a write
                rwLock.readLock().unlock();
                forceRefreshInvoiceSummary();
                rwLock.readLock().lock(); // reacquire before returning
            }
            return invoiceSummary;
        } finally {
            rwLock.readLock().unlock();
        }
    }
	
	public int refreshBillNum(Timestamp invoiceDate, String billType) {
		Timestamp startDate = AppUtils.getStartFYear(invoiceDate);
		Timestamp endDate = AppUtils.getEndFYear(invoiceDate);
		Optional<Integer> billnum;
		billnum = switch(billType) {
			case "CM" -> headerRepository.getBillNoByBillType(billType, startDate, endDate); 
			default -> headerRepository.getBillNo(startDate, endDate);
		};
		if(billnum.isEmpty()) {
			return Integer.parseInt(String.valueOf(AppUtils.getFinancialYear(invoiceDate)) 
					+ "001");
		}
		return billnum.get();
	}
	
	@Transactional(rollbackFor = Exception.class)
	@Retryable(maxAttempts = 3, backoff = @Backoff(delay = 1000))
	public String deleteBillByInvoice(int billnum, String billType) throws Exception {
		int count = headerRepository.deleteByTnbillnoAndTnbilltype(billnum, billType);
		if(count > 1) {
			throw new ColorWorldException("Delete count greater than 1 " + count);
		}
		log.info("Delete from SSTNHDP");
		int gstcount = gstRepository.deleteAllByGnbillAndGnbilltype(billnum, billType);
		if(gstcount >= 5) {
			throw new ColorWorldException("Delete count greater than 1 " + count);
		}
		log.info("Delete from SSGNJNP");
		transactionRepository.deleteInvoice(billnum, billType);
		log.info("Delete from SSTNJNP");
		return "Bill deleted successfully";
	}

	public TaxInvoice getBillDetails(String billnum, String billType) {
		TaxInvoice taxInvoice = new TaxInvoice();
		taxInvoice.setHeader(headerRepository.getByTnbillnoAndTnbilltype(Integer.parseInt(billnum), billType));
		taxInvoice.setGst(gstRepository.getByGnbillAndGnbilltype(Integer.parseInt(billnum), billType));
		taxInvoice.setDetails(transactionRepository.getTransaction(Integer.parseInt(billnum), billType));
		return taxInvoice;
	}
}
