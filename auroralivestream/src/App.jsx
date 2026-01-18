import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import DeleteAccount from './pages/DeleteAccount';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="terms" element={<Terms />} />
        <Route path="delete-account" element={<DeleteAccount />} />
        {/* Fallback route or 404 can be added here */}
      </Route>
    </Routes>
  );
}

export default App;
