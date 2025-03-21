import { useEffect, useState } from "react";
import NavBar from "./NavBar";
import { Path, SelectedFile, SelectedFiles } from "./context";
import { PathContext } from "./context";
import ActionBar from "./ActionBar";
import SideBar from "./SideBar";
import Main from "./Main";

export default function Index() {
	useEffect(() => {
		const hasKey = document.cookie.includes("key=");
		if (!hasKey) {
		}
	}, []);

	const [path, setPath] = useState<PathContext>({ current: ["C:\\"] });
	const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);

	return (
		<div className="flex h-dvh w-full flex-col items-start">
			<Path.Provider value={{ path, setPath }}>
				<SelectedFiles.Provider value={{ selectedFiles, setSelectedFiles }}>
					<NavBar />
					<ActionBar />
					<div className="flex w-full flex-1">
						<SideBar />
						<Main />
					</div>
				</SelectedFiles.Provider>
			</Path.Provider>
		</div>
	);
}
