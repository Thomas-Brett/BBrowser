import "./App.css";
import Login from "./login/Login";
import { HashRouter, Routes, Route } from "react-router";
import Index from "./index/Index";

function App() {
	return (
		<div id="App">
			<HashRouter>
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/" element={<Index />} />
				</Routes>
			</HashRouter>
		</div>
	);
}

export default App;
