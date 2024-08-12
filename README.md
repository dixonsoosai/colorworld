# colorworld
Billing Software for Retail Business

#Project Setup

Pre-requisties:
1) OpenJdk17
2) MS Access
3) Eclipse
4) Visual Studio
5) Nodejs 18.16.0
6) Tomcat 10

Steps:
1) File -> Import -> Projects from Git
2) Enter all the details viz. URI, username & password
3) Select master branch
4) Import
5) mvn clean install

#Angular
npm install
npm start

#WhiteLabel
1. application.properties -> server.servlet.context-path, spring.datasource.url, 
	                         company.name, company.description, company.address, 
	                         company.contact, overflowLimit, account.details
2. Posting Controller -> Default Value
3. package.json -> base-href
4. src -> app -> layout -> topbar & footer
5. src -> app -> demo -> uikit -> tax-invoice -> overflowLimit
6. pom.xml -> war file

#Docker File
1. Change the working directory to colorworld
2. docker build -t repo/invoice:v1 .
3. docker run -p 8080:8080 -name color-world -it repo/invoice:v1 #Parameter Sequence is important
4. docker exec -it container_id sh #SSH into Docker Container