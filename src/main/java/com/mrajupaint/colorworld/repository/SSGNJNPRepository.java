package com.mrajupaint.colorworld.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mrajupaint.colorworld.entity.SSGNJNP;
import com.mrajupaint.colorworld.entity.SSGNJNP_KEY;

@Repository
public interface SSGNJNPRepository extends JpaRepository<SSGNJNP, SSGNJNP_KEY> {

}
