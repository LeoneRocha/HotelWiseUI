Hotel Wise
Descrição
Hotel Wise é uma aplicação full-stack desenvolvida para facilitar a busca e reserva de hotéis de maneira "humanizada" usando Inteligência Artificial e Semantic Kernel. A aplicação utiliza React com TypeScript no frontend e uma API REST em C# com .NET 8 no backend. O banco de dados é gerenciado com MySQL e Entity Framework Core 8.

Funcionalidades Principais
Busca "Humanizada" de Hotéis: Utiliza IA e Semantic Kernel para oferecer uma experiência de busca intuitiva e inteligente.

Gestão de Hotéis: Adicionar, editar e remover hotéis.

Reservas: Funcionalidades de reserva e gestão de reservas.

Autenticação e Autorização: Sistema de login seguro para usuários e administradores.

Integração com Docker: Facilita a criação e implantação de containers.

Pipeline de DevOps: Implementação de CI/CD com Git pipeline.

Qualidade de Código: Análise contínua do código com SonarCloud.

Tecnologias Utilizadas
Frontend
React

TypeScript

Semantic UI / Material-UI (ou outro framework de UI)

Redux (para gerenciamento de estado)

Backend
C#

.NET 8

Entity Framework Core 8

MySQL

DevOps & Ferramentas
Docker

Azure DevOps / GitHub Actions

SonarCloud

Pré-requisitos
Node.js

Docker

.NET SDK 8

MySQL

Configuração do Ambiente de Desenvolvimento
Backend
Clone o repositório:

sh
git clone https://github.com/seuprojeto/hotel-wise-backend.git
cd hotel-wise-backend
Configure a string de conexão com o MySQL no appsettings.json.

Execute as migrações do Entity Framework:

sh
dotnet ef database update
Inicie a aplicação:

sh
dotnet run
Frontend
Clone o repositório:

sh
git clone https://github.com/seuprojeto/hotel-wise-frontend.git
cd hotel-wise-frontend
Instale as dependências:

sh
npm install
Inicie a aplicação:

sh
npm start
Estrutura do Projeto
Frontend
hotel-wise-frontend/
|-- src/
|   |-- components/
|   |-- pages/
|   |-- redux/
|   |-- services/
|   |-- App.tsx
|   |-- index.tsx
|-- public/
|-- package.json
Backend
hotel-wise-backend/
|-- Controllers/
|-- Models/
|-- Services/
|-- Repositories/
|-- Program.cs
|-- Startup.cs
|-- appsettings.json
CI/CD
A configuração de CI/CD pode ser feita usando Azure DevOps ou GitHub Actions. Abaixo está um exemplo de pipeline YAML para GitHub Actions:

yaml
name: CI/CD Pipeline

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest

    services:
      mysql:
        image: mysql:latest
        ports:
          - 3306:3306
        env:
          MYSQL_ROOT_PASSWORD: root
          MYSQL_DATABASE: hotelwise

    steps:
    - uses: actions/checkout@v2
    - name: Set up Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
    - name: Set up .NET
      uses: actions/setup-dotnet@v1
      with:
        dotnet-version: '8.x'
    - name: Install dependencies
      run: npm install
    - name: Run tests
      run: npm test
    - name: Build application
      run: npm run build
    - name: Publish .NET API
      run: dotnet publish -c Release -o out
    - name: Run SonarCloud Scan
      uses: sonarsource/sonarcloud-github-action@v1
      with:
        projectKey: your-project-key
        organization: your-organization
        scannerParams: '-Dsonar.sources=./src'

  deploy:
    runs-on: ubuntu-latest
    needs: build

    steps:
    - name: Deploy to Docker
      run: |
        docker build -t your-image-name .
        docker run -d -p 80:80 your-image-name
Como Contribuir
Faça um fork do projeto.

Crie uma nova branch (git checkout -b feature/nome-da-sua-feature).

Commit suas mudanças (git commit -am 'Adicionei uma nova feature').

Faça push para a branch (git push origin feature/nome-da-sua-feature).

Abra um Pull Request.

Licença
Este projeto é licenciado sob a Licença MIT - veja o arquivo LICENSE para mais detalhes
