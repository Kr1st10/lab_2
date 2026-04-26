import { Route, Routes } from "react-router-dom";
import { Header } from "./components/Header";
import { FilePage } from "./pages/FilePage";
import { FolderPage } from "./pages/FolderPage";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";

export default function App() {
  return (
    <div className="app-shell">
      <Header />
      <main className="page-shell">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/folders/:id" element={<FolderPage />} />
          <Route path="/files/:id" element={<FilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}

