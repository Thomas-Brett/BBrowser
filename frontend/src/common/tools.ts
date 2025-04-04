const byteToHex: string[] = [];

for (let n = 0; n <= 0xff; ++n) {
	const hexOctet = n.toString(16).padStart(2, "0");
	byteToHex.push(hexOctet);
}

export function bufferToHex(buffer: ArrayBuffer): string {
	const buff = new Uint8Array(buffer);
	const hexOctets = new Array(buff.length);

	for (let i = 0; i < buff.length; ++i) hexOctets[i] = byteToHex[buff[i]];

	return hexOctets.join("");
}

export function getKey(): string {
	if (window.location.pathname === "/login") return "";
	if (document.cookie === "") return (window.location.href = "#/login");
	const key = document.cookie
		.split("; ")
		.find((row) => row.startsWith("key="))
		?.split("=")[1];
	if (!key) return (window.location.href = "#/login");
	return key;
}

export function formatSize(size: number) {
	if (size > 1024 * 1024 * 1024) return (size / 1024 / 1024 / 1024).toFixed(2) + " GB";
	if (size > 1024 * 1024) return (size / 1024 / 1024).toFixed(2) + " MB";
	if (size > 1024) return (size / 1024).toFixed(2) + " KB";
	return size + " B";
}

export function getFileType(name: string) {
	const ext = name.split(".").pop();
	if (!ext) return "unknown";
	if (ext === "jpg" || ext === "jpeg" || ext === "png" || ext === "gif" || ext === "bmp" || ext === "ico" || ext === "webp") return "image";
	if (ext === "mp4" || ext === "avi" || ext === "mov" || ext === "wmv" || ext === "flv" || ext === "mpeg" || ext === "mpg") return "video";
	return "unknown";
}
