import { useContext, useState } from "react";
import Logo from "../common/Logo";
import { IoArrowUpOutline } from "react-icons/io5";

import { IoIosArrowBack, IoIosArrowForward, IoIosRefresh } from "react-icons/io";

import { FaChevronRight, FaSearch } from "react-icons/fa";
import { Path } from "./context";

export default function NavBar() {
	const { path, setPath } = useContext(Path);
	const [navHistory, setNavHistory] = useState<string[][]>([]);
	const [currentPathIndex, setCurrentPathIndex] = useState<number>(0);
	const [pathInputSelected, setPathInputSelected] = useState<boolean>(false);
	const [searchBarValue, setSearchBarValue] = useState<string>("");
	const [pathInputText, setPathInputText] = useState<string>("");

	const backArrowClick = () => {
		if (navHistory.length === 0) return;
		const newPath = navHistory[currentPathIndex - 1];
		setPath({ current: newPath });
		setCurrentPathIndex(currentPathIndex - 1);
	};

	const forwardArrowClick = () => {
		if (navHistory.length === 0) return;
		const newPath = navHistory[currentPathIndex + 1];
		setPath({ current: newPath });
		setCurrentPathIndex(currentPathIndex + 1);
	};

	const upArrowClick = () => {
		if (path.current.length === 1) return;
		const newPath = path.current.slice(0, -1);
		setPath({ current: newPath });
		setCurrentPathIndex(currentPathIndex + 1);
		setNavHistory([...navHistory, newPath]);
	};

	const enterPath = () => {
		if (!pathInputSelected) return;
		if (pathInputText === "") return;
		setPathInputSelected(false);
		const newPath = pathInputText.split("\\");
		if (newPath[newPath.length - 1] === "") newPath.pop();
		if (newPath[0] === "") newPath[0] = "C:\\";
		newPath[newPath.length - 1] += "\\";
		setPath({ current: newPath });
		setCurrentPathIndex(currentPathIndex + 1);
		setNavHistory([...navHistory, newPath]);
	};

	const partClick = (part: string) => {
		if (part === "C:\\") {
			setPath({ current: ["C:\\"] });
			setCurrentPathIndex(0);
			setNavHistory([]);
		} else if (part === "..") {
			if (path.current.length === 1) return;
			const newPath = path.current.slice(0, -1);
			setPath({ current: newPath });
			setCurrentPathIndex(currentPathIndex + 1);
			setNavHistory([...navHistory, newPath]);
		} else {
			while (path.current.length > 1 && path.current[path.current.length - 1] !== part) {
				path.current.pop();
			}
			setPath({ current: path.current });
			setCurrentPathIndex(currentPathIndex + 1);
			setNavHistory([...navHistory, path.current]);
		}
	};

	return (
		<div className="bg-primary-panel border-border flex h-14 w-full flex-row items-center justify-between border-b px-2 py-2 drop-shadow-sm">
			<div>
				<Logo className="my-0 mr-2 text-4xl" />
			</div>
			<div className="mr-4 flex h-full flex-row items-center text-2xl text-gray-300">
				<FileAction icon={<IoIosArrowBack />} onClick={backArrowClick} />
				<FileAction icon={<IoIosArrowForward />} onClick={forwardArrowClick} />
				<FileAction icon={<IoArrowUpOutline />} onClick={upArrowClick} />
				<FileAction icon={<IoIosRefresh />} onClick={() => {}} />
			</div>
			<div className="bg-primary relative flex h-9 w-2/3 flex-row items-center rounded-lg font-bold">
				<input
					type="text"
					className="focus:border-border absolute h-full w-full rounded-lg border border-transparent bg-transparent px-3 text-gray-300 transition-all duration-200 focus:border focus:outline-none"
					onFocus={() => {
						setPathInputSelected(true);
						setPathInputText(path.current.join("\\"));
					}}
					onBlur={() => {
						enterPath();
					}}
					value={pathInputSelected ? pathInputText : ""}
					onChange={(e) => {
						setPathInputText(e.target.value);
					}}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							enterPath();
							(e.target as HTMLInputElement).blur();
						}
					}}
				/>
				<div className={pathInputSelected ? "hidden" : "ml-2 flex"}>
					{path.current.map((part) => (
						<div
							key={part}
							className="hover:bg-primary-panel-hover my-1 mr-1 flex cursor-pointer flex-row items-center rounded text-gray-300 drop-shadow"
							onClick={() => {
								partClick(part);
							}}
						>
							<div className="mx-1 select-none">{part.replaceAll("\\", "")}</div>
							{part === path.current[path.current.length - 1] ? "" : <FaChevronRight className="text-sm" />}
						</div>
					))}
				</div>
			</div>
			<div className="bg-primary ml-4 flex h-9 flex-row items-center rounded-lg text-gray-300 drop-shadow outline-none focus-within:border focus-within:border-white">
				<FaSearch className="m-2" />
				<input type="text" className="bg-primary outline-none" placeholder="Search..." />
			</div>
		</div>
	);
}

function FileAction({ icon, onClick }: { icon: React.ReactNode; onClick: () => void }) {
	return (
		<div className="hover:bg-primary-panel-hover mx-0.5 flex h-full cursor-pointer items-center rounded p-1 hover:text-white" onClick={onClick}>
			{icon}
		</div>
	);
}
