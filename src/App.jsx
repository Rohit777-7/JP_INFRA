import AppRoutes from "./routes/AppRoutes";
import { MenuOverlayProvider } from "./context/MenuOverlayContext";

function App() {
  return (
    <MenuOverlayProvider>
      <AppRoutes />
    </MenuOverlayProvider>
  );
}

export default App;