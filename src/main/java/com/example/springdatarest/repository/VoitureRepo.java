package com.example.springdatarest.repository;

import com.example.springdatarest.modele.Voiture;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@Repository
@RepositoryRestResource(path = "voitures")
@CrossOrigin(origins = "http://localhost:3002")

public interface VoitureRepo extends CrudRepository<Voiture, Long> {

    List<Voiture> findByMarque(@Param("marque") String marque);

    List<Voiture> findByCouleur(@Param("couleur") String couleur);

    List<Voiture> findByAnnee(@Param("annee") int annee);

    List<Voiture> findByMarqueAndModele(@Param("marque") String marque, @Param("modele") String modele);

    List<Voiture> findByMarqueOrCouleur(@Param("marque") String marque, @Param("couleur") String couleur);

    List<Voiture> findByMarqueOrderByAnneeAsc(@Param("marque") String marque);

    @Query("select v from Voiture v where v.marque = :marque")
    List<Voiture> findByMarqueSQL(@Param("marque") String marque);

    @Query("select v from Voiture v where v.marque like %:marque")
    List<Voiture> findByMarqueEndsWith(@Param("marque") String marque);
}