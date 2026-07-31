# Hotel Wise

## About
A pilot project showcasing the concept of AI integration both for semantic search and customer support via chatbot. The system manages hotel registration, rooms, availability, and pricing, leveraging AI technologies such as Semantic Search Kernel and Mistral Inference, Qdrant for enhanced search capabilities, and payment API integration.

## Main Features
- **Humanized Hotel Search:** Utilizes AI and Semantic Kernel to provide an intuitive and intelligent search experience.
- **Hotel Management:** Add, edit, and remove hotels.
- **Authentication and Authorization:** Secure login system for users and administrators (local JWT + Microsoft Entra ID via MSAL).
- **Docker Integration:** Simplifies container creation and deployment.
- **DevOps Pipeline:** Continuous Integration/Continuous Deployment (CI/CD) using Git pipelines.
- **Code Quality:** Continuous code analysis with SonarCloud.

## Links
- **DevOps Pipeline:** [Azure DevOps Pipeline](https://lionscorp.visualstudio.com/VariousStudies/_build)
- **SonarCloud:**
  - [Backend Analysis](https://sonarcloud.io/summary/new_code?id=lionscorp_hotelwiseapi&branch=master)
  - [Frontend Analysis](https://sonarcloud.io/summary/new_code?id=lionscorp_hotelwiseui&branch=master)
- **Go Live:**
  - [API](https://hotelwiseapi-hbcca8d5a7fae7hp.brazilsouth-01.azurewebsites.net/swagger/index.html)
  - [Frontend](https://hotelwiseui-f7a7b5gqf0amdfdg.brazilsouth-01.azurewebsites.net/)
- **Source Code:**
  - [Backend Repository](https://github.com/LeoneRocha/HotelWiseAPI)
  - [Frontend Repository](https://github.com/LeoneRocha/HotelWiseUI)

## Technologies Used
### Frontend (`HotelWiseUI`)
- React **19.2**
- Vite **8**
- React Router **8** (single `react-router` package; `react-router-dom` removed)
- Bootstrap / React Bootstrap
- TypeScript **6.0.3** (ESLint / peers) + **7.0.2** for `tsc -b` via npm alias `typescript7`
- ESLint **10** (React Compiler rules enabled)
- MSAL (`@azure/msal-browser` / `@azure/msal-react` **5.x**)
- Node.js **^20.19 || >=22.12**
- Nginx Server (container / hosting)

### Backend
- C#
- .NET 8
- Entity Framework Core
- MySql
- Swagger

### DevOps & Tools
- GitHub
- Azure DevOps
- SonarCloud
- Docker Hub
- Azure Cloud

### Testing
- **Vitest 4** + `@vitest/coverage-v8` + jsdom
- Testing Library (React / DOM / user-event / jest-dom)
- Jest / `vite-jest` / `ts-jest` **removed**

### Additional Technologies
- Qdrant
- Mistral Inference

## Prerequisites
- Node.js `^20.19.0` or `>=22.12.0`
- Docker (optional, for containers)
- .NET SDK 8 (backend)
- MySQL (backend)

## Frontend — quick start

```bash
cd HotelWiseUI
npm ci
npm run dev          # Vite dev server
npm test             # Vitest (single run)
npm run test:watch   # Vitest watch
npm run lint
npm run build        # TypeScript 7 (tsc -b) + Vite production build
npm run build:prod
```

Environment variables used by Vite (see `.env*`): `VITE_API_BASE_URL`, `VITE_UI_VERSION`.

## Documentation

Package upgrade notes and homologated set live under `DOCUMENTACAO/UI/`:

- `2026-07-LevantamentoConjuntoHomologado-HotelWiseUI.md`
- `PlanoImplementacaoAtualizacaoReact-HotelWiseUI.md`
- `RelatorioAtualizacaoReact-HotelWiseUI.md`
