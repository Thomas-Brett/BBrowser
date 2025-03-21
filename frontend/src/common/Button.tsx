import { FaCircleNotch } from "react-icons/fa6";
import { motion } from "motion/react";

interface ButtonProps {
	children: React.ReactNode;
	type?: "default" | "transparent" | "delete";
	className?: string;
	loading?: boolean;
	[key: string]: any;
}

export default function Button({ children, transparent, loading, type = "default", className, ...rest }: ButtonProps) {
	const baseClasses =
		"flex items-center justify-center py-3 px-4 rounded-md text-sm leading-none font-medium duration-150 text-center select-none cursor-pointer";
	const transparentClasses = "bg-transparent hover:bg-zinc-500/40 active:bg-zinc-500/30 text-black border border-black ";
	const defaultClasses = "bg-accent hover:bg-accent-hover active:bg-accent-active text-white";
	const deleteClasses = "bg-red-100 hover:bg-red-200/90 active:bg-red-100/80 text-red-700/90 border border-red-700";
	const disabledClasses = "opacity-50 pointer-events-none";

	const classList = `${baseClasses} ${type === "transparent" ? transparentClasses : type === "delete" ? deleteClasses : defaultClasses} ${loading && disabledClasses} ${className}`;

	return (
		<motion.button className={classList} {...rest} disabled={loading} whileTap={loading ? undefined : { scale: 0.98 }}>
			{loading ? <FaCircleNotch className="animate-spin" /> : children}
		</motion.button>
	);
}
