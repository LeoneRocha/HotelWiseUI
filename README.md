<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0"> 
</head>
<body>

<h1>Hotel Wise</h1>

<h2>Descrição</h2>
<p><strong>Hotel Wise</strong> é uma aplicação full-stack desenvolvida para facilitar a busca e reserva de hotéis de maneira "humanizada" usando Inteligência Artificial e Semantic Kernel. A aplicação utiliza React com TypeScript no frontend e uma API REST em C# com .NET 8 no backend. O banco de dados é gerenciado com MySQL e Entity Framework Core 8.</p>

<h2>Funcionalidades Principais</h2>
<ul>
    <li><strong>Busca "Humanizada" de Hotéis:</strong> Utiliza IA e Semantic Kernel para oferecer uma experiência de busca intuitiva e inteligente.</li>
    <li><strong>Gestão de Hotéis:</strong> Adicionar, editar e remover hotéis.</li>    
    <li><strong>Autenticação e Autorização:</strong> Sistema de login seguro para usuários e administradores.</li>
    <li><strong>Integração com Docker:</strong> Facilita a criação e implantação de containers.</li>
    <li><strong>Pipeline de DevOps:</strong> Implementação de CI/CD com Git pipeline.</li>
    <li><strong>Qualidade de Código:</strong> Análise contínua do código com SonarCloud.</li>
</ul>

## DevOPS

https://lionscorp.visualstudio.com/VariousStudies/_build

## SonarCloud

[https://sonarcloud.io/project/overview?id=lionscorp_hotelwiseapi](https://sonarcloud.io/project/branches_list?id=lionscorp_hotelwiseui)

## GO LIVE 

[LINK API](https://hotelwiseapi-hbcca8d5a7fae7hp.brazilsouth-01.azurewebsites.net/swagger/index.html)

[LINK UI](https://hotelwiseui-f7a7b5gqf0amdfdg.brazilsouth-01.azurewebsites.net/)

<h2>Tecnologias Utilizadas</h2>
<h3>Frontend</h3>
<ul>
    <li>React</li>
    <li>TypeScript</li>  
</ul>

<h3>Backend</h3>
<ul>
    <li>C#</li>
    <li>.NET 8</li>
    <li>Entity Framework Core 8</li>
    <li>MySQL</li>
</ul>

<h3>DevOps & Ferramentas</h3>
<ul>
    <li>Docker</li>
    <li>Azure DevOps / GitHub Actions</li>
    <li>SonarCloud</li>
</ul>

<h2>Pré-requisitos</h2>
<ul>
    <li>Node.js</li>
    <li>Docker</li>
    <li>.NET SDK 8</li>
    <li>MySQL</li>
</ul>

<h2>Configuração do Ambiente de Desenvolvimento</h2>

<h3>Backend</h3>
<ol>
    <li>Clone o repositório:
        <pre><code>git clone https://github.com/seuprojeto/hotel-wise-backend.git
cd hotel-wise-backend
        </code></pre>
    </li>
    <li>Configure a string de conexão com o MySQL no <code>appsettings.json</code>.</li>
    <li>Execute as migrações do Entity Framework:
        <pre><code>dotnet ef database update
        </code></pre>
    </li>
    <li>Inicie a aplicação:
        <pre><code>dotnet run
        </code></pre>
    </li>
</ol>

<h3>Frontend</h3>
<ol>
    <li>Clone o repositório:
        <pre><code>git clone https://github.com/seuprojeto/hotel-wise-frontend.git
cd hotel-wise-frontend
        </code></pre>
    </li>
    <li>Instale as dependências:
        <pre><code>npm install
        </code></pre>
    </li>
    <li>Inicie a aplicação:
        <pre><code>npm start
        </code></pre>
    </li>
</ol>

<h2>Estrutura do Projeto</h2>

<h3>Frontend</h3>
<pre><code>
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
</code></pre>

<h3>Backend</h3>
<pre><code>
hotel-wise-backend/
|-- Controllers/
|-- Models/
|-- Services/
|-- Repositories/
|-- Program.cs
|-- Startup.cs
|-- appsettings.json
</code></pre>

<h2>CI/CD</h2>
<p>A configuração de CI/CD pode ser feita usando Azure DevOps ou GitHub Actions. Abaixo está um exemplo de pipeline YAML para GitHub Actions:</p>

<pre><code>
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
</code></pre>

<h2>Como Contribuir</h2>
<ol>
    <li>Faça um fork do projeto.</li>
    <li>Crie uma nova branch (<code>git checkout -b feature/nome-da-sua-feature</code>).</li>
    <li>Commit suas mudanças (<code>git commit -am 'Adicionei uma nova feature'</code>).</li>
    <li>Faça push para a branch (<code>git push origin feature/nome-da-sua-feature</code>).</li>
    <li>Abra um Pull Request.</li>
</ol>

<h2>Licença</h2> <p>Este projeto é licenciado sob a Licença MIT - veja o arquivo <a href="LICENSE">LICENSE</a> para mais detalhes.</p> <h2>Contato</h2> <p>Para mais informações, entre em contato com <a href="mailto:seuemail@dominio.com">seuemail@dominio.com</a>.</p> </body>
