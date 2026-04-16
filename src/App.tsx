import { useEffect } from "react";
import Board from "./components/Board";
import { useBoardStore } from "./store/boardStore";
import "./App.css";

function App() {
  const loadBoard = useBoardStore.getState().loadBoard;

  useEffect(() => {
    loadBoard();
  }, []);

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100">
      <Board />
    </div>
  );
}

export default App;