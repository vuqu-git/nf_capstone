package org.pupille.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

//@Import(org.pupille.backend.TestMailConfig.class)
@SpringBootTest
@ActiveProfiles("test") // If using test-specific properties
class BackendApplicationTests {

//	@MockitoBean
//	private JavaMailSender javaMailSender;

	@Test
	void contextLoads() {
	}

}
