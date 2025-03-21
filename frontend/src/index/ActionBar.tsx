import { useContext } from "react";
import { SelectedFiles } from "./context";
import { LuFilePlus2, LuFolderPlus } from "react-icons/lu";
import { FaCut } from "react-icons/fa";
import { FaCopy, FaPaste } from "react-icons/fa6";
import { CgRename } from "react-icons/cg";
import { MdDeleteOutline } from "react-icons/md";

export default function ActionBar() {
	const { selectedFiles } = useContext(SelectedFiles);

	return (
		<div className="bg-primary border-border flex h-12 w-full items-center border-b px-2 py-2 font-semibold text-gray-300 drop-shadow">
			<div className="flex">
				<ActionButton icon={<LuFilePlus2 />} text="Create File" onClick={() => {}} />
				<ActionButton icon={<LuFolderPlus />} text="Create Folder" onClick={() => {}} />
			</div>

			<div className="bg-primary-panel mx-3 h-full w-0.5 rounded-full"></div>

			<div className="flex items-center gap-2 text-sm">
				<ActionButton icon={<FaCut />} text="Cut" onClick={() => {}} disabled={selectedFiles.length === 0} />
				<ActionButton icon={<FaCopy />} text="Copy" onClick={() => {}} disabled={selectedFiles.length === 0} />
				<ActionButton icon={<FaPaste />} text="Paste" onClick={() => {}} disabled={selectedFiles.length === 0} />
				<ActionButton icon={<CgRename className="text-2xl" />} text="Rename" onClick={() => {}} disabled={selectedFiles.length === 0} />
				<ActionButton icon={<MdDeleteOutline className="text-2xl" />} text="Delete" onClick={() => {}} disabled={selectedFiles.length === 0} />
			</div>
		</div>
	);
}

function ActionButton({ icon, text, onClick, disabled = false }: { icon: React.ReactNode; text: string; onClick: () => void; disabled?: boolean }) {
	return (
		<div
			className={
				"hover:bg-panel border-border flex items-center rounded-lg border px-2 py-1 drop-shadow " +
				(disabled ? "cursor-not-allowed opacity-50" : "hover:bg-primary-hover cursor-pointer")
			}
			onClick={onClick}
		>
			{icon}
			<p className="ml-2">{text}</p>
		</div>
	);
}
