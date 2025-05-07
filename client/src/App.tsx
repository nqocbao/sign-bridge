import "./App.css";
import { Button } from "./components/ui/button";

function App() {
  return (
    <>
      <div className="h-full w-full justify-center items-center">
        <Button className="text-primary hover:bg-red-400">Press it</Button>
      </div>
    </>
  );
}

export default App;
