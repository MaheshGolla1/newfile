# Use OpenJDK 17 as the base image
FROM openjdk:17-jdk-slim

# Set the working directory
WORKDIR /app

# Copy the Maven wrapper and pom.xml
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Make the Maven wrapper executable
RUN chmod +x mvnw

# Download dependencies (this layer will be cached if pom.xml doesn't change)
RUN ./mvnw dependency:go-offline -B

# Copy the source code
COPY src src

# Build the application
RUN ./mvnw clean package -DskipTests

# Create a non-root user
RUN addgroup --system javauser && adduser --system --ingroup javauser javauser

# Change ownership of the app directory
RUN chown -R javauser:javauser /app

# Switch to the non-root user
USER javauser

# Expose the port the app runs on
EXPOSE 8080

# Set environment variables
ENV SPRING_PROFILES_ACTIVE=prod
ENV JAVA_OPTS="-Xmx512m -Xms256m"

# Run the application
ENTRYPOINT ["java", "-jar", "target/healthcare-backend-1.0.0.jar"]
