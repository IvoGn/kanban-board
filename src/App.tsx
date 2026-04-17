import { useEffect } from "react";
import Board from "./components/Board";
import { useBoardStore } from "./store/boardStore";
import { LanguageProvider } from "./LanguageContext";
import "./App.css";

function App() {
  const loadBoard = useBoardStore.getState().loadBoard;

  useEffect(() => {
    loadBoard();
  }, []);

  return (
    <LanguageProvider>
      <div className="min-h-screen w-full bg-slate-950 text-slate-100">
        <Board />
      </div>
    </LanguageProvider>
  );
}

export default App;