package com.fhir.scheduler.repo;


import com.fhir.scheduler.entity.History;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

@Repository
@Component
public interface History_repo extends JpaRepository<History,Integer> {

}








