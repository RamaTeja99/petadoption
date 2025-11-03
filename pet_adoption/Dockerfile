# Stage 1: Build
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml ./
RUN mvn -B -q dependency:go-offline
COPY src ./src
RUN mvn -B -q clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
# Optional: run as non-root
RUN useradd -r -u 1001 spring && chown -R spring:spring /app
COPY --from=build /app/target/*.jar /app/app.jar
EXPOSE 8081
USER 1001
ENTRYPOINT ["java","-jar","/app/app.jar"]
