package com.mrajupaint.colorworld.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mrajupaint.colorworld.entity.Customer;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> {

	int deleteByJpid(int customerId);

}
