FROM eclipse-temurin:17-jdk-focal
EXPOSE 8080
RUN mkdir -p /Tax_Invoice
RUN mkdir -p /Color_World
COPY mrajupaint.accdb /Color_World
ADD target/mrajupaint.war /app/mrajupaint.war

ENTRYPOINT [ "java", "-jar" , "/app/mrajupaint.war", "--spring.profiles.active=dev"]
