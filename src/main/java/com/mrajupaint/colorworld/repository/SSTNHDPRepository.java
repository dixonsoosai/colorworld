package com.mrajupaint.colorworld.repository;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.mrajupaint.colorworld.entity.SSTNHDP;
import com.mrajupaint.colorworld.entity.SSTNHDP_KEY;
import com.mrajupaint.colorworld.model.InvoiceSummary;

@Repository
public interface SSTNHDPRepository extends JpaRepository<SSTNHDP, SSTNHDP_KEY> {

	@Query(value = "SELECT max(tnbillno) + 1 as billno FROM sstnhdp "
			+ "where tntime between :startDate and :endDate",
			nativeQuery = true)
	Optional<Integer> getBillNo(@Param("startDate") Timestamp startDate, 
			@Param("endDate") Timestamp endDate);

	SSTNHDP getByTnbillno(int billnum);

	int deleteByTnbillno(int billnum);
	
	@Query(value = "SELECT tnbillno, tnname, tnpgst, tntime, "
			+ "gngstp, gntxable, gncamt, gnsamt, gntamt "
			+ "FROM SSTNHDP h, SSGNJNP gst "
			+ "where h.tnbillno = gst.gnbill order by tntime desc"
			, nativeQuery = true)
	List<InvoiceSummary> getBills();
	
}