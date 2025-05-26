package org.pupille.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableJpaRepositories(basePackages = {
		"org.pupille.backend.mysql.termin",
		"org.pupille.backend.mysql.film",
		"org.pupille.backend.mysql.terminverknuepfung"
})
@EnableMongoRepositories(basePackages = "org.pupille.backend.news.repositories")
@EnableScheduling
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

}
