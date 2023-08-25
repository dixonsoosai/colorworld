package com.mrajupaint.colorworld.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mrajupaint.colorworld.entity.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {

	int deleteByPnpdcd(String productCode);

}
