import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AppRoutes from './routes';
 
const App: React.FC = () => {
  return (
    <div className="container">
      <h1>Gerenciamento de Hotéis </h1>
      <h2>Vite + React</h2>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div> 
      <AppRoutes />
    </div>
  );
};

export default App
