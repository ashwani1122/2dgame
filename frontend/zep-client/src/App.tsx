require("dotenv").config();
import Game from "./game/Game";
function App() {
  return (
    <div>
      <h1>Welcome to Zep Clone</h1>
      <Game />
    </div>
  );
}

export default App;
