# Use OpenJDK 17
FROM openjdk:17-jdk-slim

# Set working directory
WORKDIR /app

# Copy any JAR from target folder into the container
# This pattern works regardless of version
COPY target/*.jar app.jar

# Expose Spring Boot port
EXPOSE 8081

# Run the JAR
ENTRYPOINT ["java", "-jar", "app.jar"]
