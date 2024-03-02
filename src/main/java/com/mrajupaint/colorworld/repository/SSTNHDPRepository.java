package com.mrajupaint.colorworld.repository;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.mrajupaint.colorworld.entity.SSTNHDP;
import com.mrajupaint.colorworld.model.InvoiceSummary;

import jakarta.websocket.server.PathParam;

@Repository
public interface SSTNHDPRepository extends JpaRepository<SSTNHDP, Integer> {

	@Query(value = """
			SELECT max(tnbillno) + 1 as billno FROM sstnhdp 
			where tntime between :startDate and :endDate 
			and tnbilltype IN ('T','P')
			""",
			nativeQuery = true)
	Optional<Integer> getBillNo(@Param("startDate") Timestamp startDate, 
			@Param("endDate") Timestamp endDate);

	@Query(value = """
			SELECT max(tnbillno) + 1 as billno FROM sstnhdp 
			where tnbilltype = :billType
			""",
			nativeQuery = true)
	Optional<Integer> getBillNo(@PathParam("billType") String billType);
	
	SSTNHDP getByTnbillnoAndTnbilltype(int billnum, String billType);

	int deleteByTnbillnoAndTnbilltype(int billnum, String billType);
	
	@Query(value = """
			SELECT tnbillno, tnname, tnpgst, tnbilltype, tntime, 
			gngstp, gntxable, gncamt, gnsamt, gntamt 
			FROM SSTNHDP h, SSGNJNP gst 
			where h.tnbillno = gst.gnbill 
			order by tnbillno desc, tntime desc, gngstp"""
			, nativeQuery = true)
	List<InvoiceSummary> getInvoiceBills();

}