package com.mrajupaint.colorworld.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mrajupaint.colorworld.entity.SSTNHDP;
import com.mrajupaint.colorworld.repository.SSTNHDPRepository;

@Service
public class InvoiceService {

	@Autowired
	SSTNHDPRepository headerRepository;
	
	public List<SSTNHDP> getAllBills() {
		return headerRepository.findAll(); 
	}
	
}
