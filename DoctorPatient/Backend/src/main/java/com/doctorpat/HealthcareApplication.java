package com.doctorpat;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@OpenAPIDefinition(
    info = @Info(
        title = "Healthcare & Wellness Management System API",
        version = "1.0.0",
        description = "A comprehensive REST API for managing healthcare services, appointments, and wellness programs",
        contact = @Contact(
            name = "Healthcare Team",
            email = "support@doctorpat.com",
            url = "https://doctorpat.com"
        ),
        license = @License(
            name = "MIT License",
            url = "https://opensource.org/licenses/MIT"
        )
    ),
    servers = {
        @Server(
            description = "Local Development Server",
            url = "http://localhost:8080/api"
        ),
        @Server(
            description = "Production Server",
            url = "https://api.doctorpat.com"
        )
    }
)
public class HealthcareApplication {

    public static void main(String[] args) {
        SpringApplication.run(HealthcareApplication.class, args);
    }
}
