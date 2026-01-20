import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Match from "./Match"
import Home from "./Home"

function App() {

  return (
      <div>
          <Router >
              <Routes>
                  <Route path="/dashboard" element={<Home />} />
                  <Route path="/:id?" element={<Match />} />
              </Routes>
          </Router>
      </div>
  )
}

export default App
