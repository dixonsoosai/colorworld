package com.mrajupaint.colorworld.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.mrajupaint.colorworld.entity.SSTNJNP;

@Repository
public class TransactionRepository {

	@Autowired
	private SSTNJNPRepository sstnjnpRepository;
	
	@Transactional(rollbackFor = Exception.class)
	public void addTransaction(List<SSTNJNP> entities) throws Exception {
		deleteInvoice(entities.get(0).getTnbillno(), entities.get(0).getTnbilltype());
		sstnjnpRepository.saveAll(entities);
    }
	
	public List<SSTNJNP> getTransaction(int billnum) {
		return sstnjnpRepository.findByTnbillno(billnum);
	}
	
	@Transactional(rollbackFor = Exception.class)
	public boolean deleteInvoice(int billnum, String billType) throws Exception {
		sstnjnpRepository.deleteByTnbillnoAndTnbilltype(billnum, billType);
		return true;
	}
		
	
}
