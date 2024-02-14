package com.mrajupaint.colorworld.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mrajupaint.colorworld.entity.SSTNJNP;
import com.mrajupaint.colorworld.entity.SSTNJNP_KEY;

@Repository
public interface SSTNJNPRepository extends JpaRepository<SSTNJNP, SSTNJNP_KEY> {
	
	int deleteByTnbillnoAndTnbilltype(int billnum, String billType);

	List<SSTNJNP> findByTnbillno(int billnum);
}