import { BrowserRouter, Routes, Route } from "react-router-dom";
import Match from "./Match"
import Home from "./Home"

function App() {

  return (
      <div>
          <BrowserRouter basename="/tank-bots/">
              <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/match/:id?" element={<Match />} />
              </Routes>
          </BrowserRouter>
      </div>
  )
}

export default App
