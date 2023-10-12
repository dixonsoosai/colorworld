package com.mrajupaint.colorworld.repository;

import java.util.ArrayList;
import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.mrajupaint.colorworld.entity.SSTNJNP;
import com.mrajupaint.colorworld.exception.ColorWorldException;

@Repository
public class TransactionRepository {

	private static final Logger LOGGER = LogManager.getLogger(TransactionRepository.class);
	
	@Autowired
	private JdbcTemplate jdbcTemplate;
	
	@Transactional(rollbackFor = ColorWorldException.class)
    public void addTransaction(List<SSTNJNP> entities) throws ColorWorldException {
		
		String sql = """
				DELETE FROM colorworld.sstnjnp WHERE tnbillno = %s
				""".formatted(entities.get(0).getTnbillno());
		int deleteCount = jdbcTemplate.update(sql);
		if(deleteCount > 0) {
			LOGGER.info("Deleted Count: {}", deleteCount);
		}
	    sql = """
	    		INSERT INTO colorworld.sstnjnp(
        		tnbillno, tnchallan, tnscnnm, 
        		tnprice, tntxable, tnsamt, tncamt, tntamt, tntqty, 
        		tnuqty, tnunit, tnpdcd, tnhsnc, tncgst, tnsgst)
        		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        		""";
        List<Object[]> batchArgs = new ArrayList<>();
        
        for (var entity : entities) {
            Object[] args = {entity.getTnbillno(), 
            		entity.getTnchallan(),
            		entity.getTnscnnm(),
            		entity.getTnprice(),
            		entity.getTntxable(),
            		entity.getTnsamt(),
            		entity.getTncamt(),
            		entity.getTntamt(),
            		entity.getTntqty(),
            		entity.getTnuqty(),
            		entity.getTnunit(),
            		entity.getTnpdcd(),
            		entity.getTnhsnc(),
            		entity.getTncgst(),
            		entity.getTnsgst(),
            		};
            batchArgs.add(args);
        }
        int[] rows = jdbcTemplate.batchUpdate(sql, batchArgs);
        for(var rowCount : rows) {
        	if(rowCount != 1) {
        		throw new ColorWorldException("Error while adding bill details");
        	}
        }
    }
	
	public List<SSTNJNP> getTransaction(int billnum) {
		String sql = """
				SELECT * FROM colorworld.sstnjnp WHERE tnbillno = %d
				""".formatted(billnum);
		
		return jdbcTemplate.query(sql, (rs, rowNum) -> {
			SSTNJNP transaction = new SSTNJNP();
			transaction.setTnbillno(rs.getInt("tnbillno"));
			transaction.setTncamt(rs.getInt("tncamt"));
			return transaction;
		});
	}
	
	@Transactional(rollbackFor = Exception.class)
	public boolean deleteInvoice(int billnum) throws Exception {
		try {
			String sql = """
					DELETE FROM colorworld.sstnjnp WHERE tnbillno = %s
					""".formatted(billnum);
			jdbcTemplate.update(sql);
		} catch (DataAccessException e) {
			LOGGER.error("Exception while deleting invoice {}", e);
			throw new Exception(e.getMessage());
		}
		return true;
	}
		
	
}
