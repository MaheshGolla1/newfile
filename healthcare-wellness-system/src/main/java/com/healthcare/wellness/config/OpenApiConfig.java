package com.healthcare.wellness.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.tags.Tag;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {
    
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Healthcare & Wellness Management System API")
                        .version("1.0.0")
                        .description("A comprehensive healthcare and wellness management system API for appointment booking, service management, and user administration. " +
                                "This API provides endpoints for patients, healthcare providers, and administrators to manage appointments, wellness services, enrollments, and payments.")
                        .contact(new Contact()
                                .name("Healthcare Team")
                                .email("support@healthcare.com")
                                .url("https://healthcare-wellness.com"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(
                        new Server().url("http://localhost:8080").description("Development Server"),
                        new Server().url("https://api.healthcare-wellness.com").description("Production Server")
                ))
                .tags(List.of(
                        new Tag().name("Authentication").description("User registration and authentication endpoints"),
                        new Tag().name("Patients").description("Patient profile and management operations"),
                        new Tag().name("Providers").description("Healthcare provider profile and management operations"),
                        new Tag().name("Appointments").description("Appointment booking and management operations"),
                        new Tag().name("Wellness Services").description("Wellness service management and discovery"),
                        new Tag().name("Enrollments").description("Service enrollment and progress tracking"),
                        new Tag().name("Payments").description("Payment processing and management"),
                        new Tag().name("Users").description("User management operations (Admin only)")
                ))
                .addSecurityItem(new SecurityRequirement().addList("Bearer Authentication"))
                .components(new io.swagger.v3.oas.models.Components()
                        .addSecuritySchemes("Bearer Authentication", new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("Enter JWT token obtained from login endpoint")
                                .name("Authorization")));
    }
}
