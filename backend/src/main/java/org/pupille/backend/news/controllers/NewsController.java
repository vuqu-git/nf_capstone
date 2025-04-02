package org.pupille.backend.news.controllers;

import lombok.RequiredArgsConstructor;
import org.pupille.backend.news.exceptions.NewsUpdateException;
import org.pupille.backend.news.models.News;
import org.pupille.backend.news.services.NewsService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/news")
@RequiredArgsConstructor
public class NewsController {

    private final NewsService newsService;

    @GetMapping("/all")
    public List<News> getAllNews()
    {
        return newsService.getAllNews();
    }

    @GetMapping
    public List<News> getValidNews()
    {
        return newsService.getNewsByDateInRange();
    }

    @GetMapping("/all/{id}")
    public News getNewsItem(@PathVariable String id) {
        return newsService.getNewsById(id);
    }

    @DeleteMapping("/all/{id}")
    public void deleteNewsItem(@PathVariable String id) {
        newsService.deleteNews(id);
    }

    @PostMapping("/all")
    public News addNewsItem(@RequestBody News news) {
        return newsService.saveNews(news);
    }

    @PutMapping("/all/{id}")
    // with fine-grained exception handling because IllegalArgumentException in movieService.updateTodo is specific
    // alternatively:
    //      inside newsService.updateNews the NewsUpdateException is thrown
    //      controller focused on handling requests and responses while delegating exception handling
    public News updateNewsItem(@PathVariable String id, @RequestBody News updatedNews) {
        try {
            return newsService.updateNews(id, updatedNews);
        } catch (IllegalArgumentException ex) {
            throw new NewsUpdateException(ex.getMessage());
        }
    }

}
