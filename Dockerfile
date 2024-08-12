FROM eclipse-temurin:17-jdk-focal
EXPOSE 8080
ENV targetDir="/app"
RUN mkdir -p "${targetDir}"

COPY formula.accdb ${targetDir}
RUN ls /app
ADD target/formula.war /app/formula.war
WORKDIR /app
ENTRYPOINT ["java","-jar","/app/formula.war", "--spring.profiles.active=dev"]