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

@Repository
public interface SSTNHDPRepository extends JpaRepository<SSTNHDP, Integer> {

	@Query(value = """
			SELECT max(tnbillno) + 1 as billno FROM sstnhdp 
			where tntime between :startDate and :endDate 
			and tnbilltype = 'T'
			""",
			nativeQuery = true)
	Optional<Integer> getBillNo(@Param("startDate") Timestamp startDate, 
			@Param("endDate") Timestamp endDate);

	@Query(value = """
			SELECT max(tnbillno) + 1 as billno FROM sstnhdp 
			where tnbilltype = 'Q'
			""",
			nativeQuery = true)
	Optional<Integer> getQuotationNo();
	
	SSTNHDP getByTnbillno(int billnum);

	int deleteByTnbillnoAndTnbilltype(int billnum, String billType);
	
	@Query(value = """
			SELECT tnbillno, tnname, tnpgst, tntime, 
			gngstp, gntxable, gncamt, gnsamt, gntamt 
			FROM SSTNHDP h, SSGNJNP gst 
			where h.tnbillno = gst.gnbill and h.tnbilltype = :billType
			order by tnbillno desc, tntime desc, gngstp"""
			, nativeQuery = true)
	List<InvoiceSummary> getBills(@Param("billType") String billType);
	
}