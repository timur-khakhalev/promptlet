import Layout from './components/Layout';
import { AppProvider } from './contexts/AppContext';

function App() {
  return (
    <AppProvider>
      <Layout />
    </AppProvider>
  );
}

export default App;
