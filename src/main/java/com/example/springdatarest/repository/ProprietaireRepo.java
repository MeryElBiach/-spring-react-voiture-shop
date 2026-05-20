package com.example.springdatarest.repository;

import com.example.springdatarest.modele.Proprietaire;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProprietaireRepo extends CrudRepository<Proprietaire, Long> {
}