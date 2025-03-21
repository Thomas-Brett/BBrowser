import { useContext, useEffect, useState } from "react";
import { Path, SelectedFiles } from "./context";
import { GetFiles } from "../../wailsjs/go/main/App";
import { LuFile } from "react-icons/lu";
import { LuFolder } from "react-icons/lu";

export default function Main() {
	const { path, setPath } = useContext(Path);
	const { selectedFiles, setSelectedFiles } = useContext(SelectedFiles);
	const [files, setFiles] = useState<{ name: string; isDir: boolean; size: number; dateModified: string }[]>([]);

	const fetchFiles = async (path: string) => {
		const files = await GetFiles(path);
		setFiles(files.map((file) => ({ name: file.Name, isDir: file.IsDir, size: file.Size, dateModified: file.DateModify })));
	};

	useEffect(() => {
		fetchFiles(path.current.join("\\"));
	}, [path]);

	return (
		<div
			className="h-[calc(100vh-6.5rem)] w-full overflow-y-auto"
			onClick={(e) => {
				e.preventDefault();
				e.stopPropagation();
				if (e.target === e.currentTarget) setSelectedFiles([]);
			}}
		>
			<table className="mx-2">
				<thead>
					<tr className="text-light border-border mt-1 h-6 border-b text-start text-sm select-none">
						<th></th>
						<th className="pl-2 text-start font-normal">Name</th>
						<th className="border-border min-w-30 border-l px-2 text-start font-normal">Date Modified</th>
						<th className="border-border min-w-20 border-l px-2 text-start font-normal">Size</th>
					</tr>
				</thead>
				<tbody>
					{files.map((data, index) => (
						<tr
							key={index}
							className={
								(selectedFiles.some((file) => file.name === data.name) ? "bg-primary-panel " : "") +
								"hover:bg-primary-panel text-light mt-0.5 cursor-pointer select-none"
							}
							onClick={(e) => {
								e.preventDefault();
								if (e.ctrlKey) {
									setSelectedFiles([...selectedFiles, { name: data.name }]);
									return;
								} else if (e.shiftKey) {
									const lastIndex = files.findIndex((file) => file.name === selectedFiles[0].name);
									const currentIndex = files.findIndex((file) => file.name === data.name);
									const filesSelected = files.slice(Math.min(lastIndex, currentIndex), Math.max(lastIndex, currentIndex) + 1);
									setSelectedFiles(filesSelected.map((file) => ({ name: file.name })));
									return;
								} else setSelectedFiles([{ name: data.name }]);
							}}
							onDoubleClick={() => {
								if (data.isDir) {
									setPath({ current: [...path.current, data.name] });
								}
							}}
						>
							<td className="rounded-l-md pr-1 pl-2">{data.isDir ? <LuFolder /> : <LuFile />}</td>
							<td className="mt-2 max-w-96 truncate rounded-l px-2 pr-8 text-white/90">{data.name}</td>
							<td className="border-border border-l px-2 text-start font-normal">{new Date(data.dateModified).toLocaleString()}</td>
							<td className="border-border rounded-r border-l px-2 text-start font-normal">{data.isDir ? "" : formatSize(data.size)}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

function formatSize(size: number) {
	if (size > 1024 * 1024 * 1024) return (size / 1024 / 1024 / 1024).toFixed(2) + " GB";
	if (size > 1024 * 1024) return (size / 1024 / 1024).toFixed(2) + " MB";
	if (size > 1024) return (size / 1024).toFixed(2) + " KB";
	return size + " B";
}
