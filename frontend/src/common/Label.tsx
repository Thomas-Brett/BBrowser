interface Properties {
	children: React.ReactNode;
	customClasses?: string;
	[key: string]: any;
}

export default function Label({ children, customClasses, ...rest }: Properties) {
	const classList = `block text-[0.8rem] font-medium text-zinc-400 select-none mb-1 ${customClasses?.length ? " " + customClasses : ""}`;
	return (
		<label className={classList} {...rest}>
			{children}
		</label>
	);
}
