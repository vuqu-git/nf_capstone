package org.pupille.backend.news.repositories;

import org.pupille.backend.news.models.News;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface NewsRepo extends MongoRepository<News, String>{

    List<News> findAllByOrderByEndDateDesc();

    // @Query annotation for more complex queries
    @Query("{ $and: [{ startDate: { $lte: ?0 } }, { endDate: { $gte: ?0 } }] }")
    List<News> findAllValidNewsByDateInRange(LocalDate date);

    // alternatively: using method naming convention for derived query
}