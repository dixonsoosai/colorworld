package com.mrajupaint.colorworld.repository;

import java.sql.Timestamp;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mrajupaint.colorworld.entity.SSACRGP;
import com.mrajupaint.colorworld.entity.SSACRGP_KEY;

@Repository
public interface SSACRGPRepository extends JpaRepository<SSACRGP, SSACRGP_KEY> {

	List<SSACRGP> findByArdateBetween(Timestamp startDate, Timestamp endDate);

	List<SSACRGP> findByArname(String companyName);

	int deleteByArbillno(String billNo);

	List<SSACRGP> findByArbillno(String billnum);

	List<SSACRGP> findByArbillnoAndArnameAndArdateBetween(String billnum, String companyName, Timestamp startDate,
			Timestamp endDate);

	List<SSACRGP> findByArbillnoAndArname(String billnum, String companyName);

	List<SSACRGP> findByArbillnoAndArdateBetween(String billnum, Timestamp startDate, Timestamp endDate);

	List<SSACRGP> findByArnameAndArdateBetween(String companyName, Timestamp startDate, Timestamp endDate);

	int deleteByArbillnoAndArname(String billNo, String companyName);

}
