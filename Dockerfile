FROM eclipse-temurin:21
COPY backend/target/backend-0.0.1-SNAPSHOT.jar /app.jar
EXPOSE 8080
ENV TZ=Europe/Berlin
ENTRYPOINT ["java", "-jar", "app.jar"]