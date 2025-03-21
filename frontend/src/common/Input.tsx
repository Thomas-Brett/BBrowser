interface Properties {
	type?: string;
	customClasses?: string;
	error?: boolean;
	warning?: boolean;
	[key: string]: any;
}

export default function Field({ type = "text", customClasses = "", error, warning, ...rest }: Properties) {
	let colors = error
		? "bg-red-200 text-red-600 focus:bg-red-100"
		: warning
			? "bg-amber-200 text-amber-600 focus:bg-amber-100"
			: "bg-zinc-500/50 text-white focus:bg-zinc-500/85";
	let classList = `${colors} py-2.5 px-4 rounded-md text-sm leading-none duration-150 focus:outline-none ${customClasses}`;

	return <input type={type} className={classList} {...rest} />;
}
