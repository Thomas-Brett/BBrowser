"use client";

interface Props {
	children: React.ReactNode;
	className?: string;
}

export default function Container({ children, className = "" }: Props) {
	return <div className={"bg-primary-panel border-border flex h-fit flex-col rounded border px-2 py-1 text-white " + className}>{children}</div>;
}
