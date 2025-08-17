package org.pupille.backend.news.services;

import lombok.RequiredArgsConstructor;
import org.pupille.backend.news.exceptions.NewsNotFoundException;
import org.pupille.backend.news.models.News;
import org.pupille.backend.news.repositories.NewsRepo;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NewsService {

    private final NewsRepo newsRepo;
    private final IdService idService;
    private final DateNowService dateNowService;

    // without usage of @RequiredArgsConstructor you need:
    //    // Constructor for dependency injection
    //    // @Autowired is technically optional here if there's only one constructor (Spring 4.3+)
    //    // but it's good practice for clarity or if you add more constructors later
    //    public NewsService(NewsRepo newsRepo, IdService idService, DateNowService dateNowService) {
    //        this.newsRepo = newsRepo;
    //        this.idService = idService;
    //        this.dateNowService = dateNowService;
    //    }

    private static final String errorMessage = "No news found with the id %s";

    public List<News> getAllNews() {
        return newsRepo.findAllByOrderByEndDateDesc();
    }

//    // when don't use repo method Naming Convention for Sorting
//    public List<News> getAllNews() {
//        List<News> newsList = newsRepo.findAll();
//        newsList.sort(Comparator.comparing(News::endDate));
//        return newsList;
//        return newsRepo.findAll();
//    }

    public News getNewsById(String id) {
        return newsRepo.findById(id)
                       .orElseThrow(
                            () -> new NewsNotFoundException(String.format(errorMessage, id))
                        );
    }

    public News saveNews(News newNews){
        String id = idService.randomId();
        News newsToSave = newNews.withId(id);
        return newsRepo.save(newsToSave);
    }

    public void deleteNews(String id) {
        if (newsRepo.existsById(id)) {
            newsRepo.deleteById(id);
        } else {
            throw new NewsNotFoundException(String.format(errorMessage, id));
        }
    }

    public News updateNews(String targetId, News updatedNews) {

        if (!newsRepo.existsById(targetId)) {
            throw new NewsNotFoundException(String.format(errorMessage, targetId));
        }

        // Ensure the id in the updatedNews matches the path variable id.
        if (!targetId.equals(updatedNews.id())) {
            throw new IllegalArgumentException("ID in path and body do not match");
        }
        return newsRepo.save(updatedNews);
    }

    // ########################################
    // now non standard service queries/methods

    public List<News> getAllValidNewsByDateInRange() {
        LocalDate currentDate = dateNowService.localDateNow();
        List<News> newsList = newsRepo.findAllValidNewsByDateInRange(currentDate);
        newsList.sort(Comparator.comparing(News::endDate));
        return newsList;
    }
}