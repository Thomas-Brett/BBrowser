import { useState } from "react";
import Button from "../common/Button";
import Container from "../common/Container";
import Logo from "../common/Logo";
import { bufferToHex } from "../common/tools";
import Field from "../common/Input";
import Label from "../common/Label";

export default function Login() {
	const [password, setPassword] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [pendingLogin, setPendingLogin] = useState(false);

	function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
		if (event.key === "Enter") requestLogin();
	}

	const requestLogin = async () => {
		if (password === "") {
			setPasswordError("Please enter a decryption key.");
			return;
		}

		setPendingLogin(true);
		setPasswordError("");

		const pwHash = await crypto.subtle.digest("SHA-512", new TextEncoder().encode(password));

		const pwHex = bufferToHex(pwHash);

		document.cookie = `key=${pwHex}`;
		window.location.href = "/";
	};

	return (
		<div className="bg-primary flex h-dvh w-full items-center justify-center">
			<Container className="w-96 items-center">
				<Logo className="my-6" />
				<h1 className="my-1 text-2xl font-bold">BASTION BROWSER</h1>
				<div className="my-2 flex w-full flex-col px-4">
					<Label>DECRYPTION KEY</Label>
					<Field
						label="DECRYPTION KEY"
						onKeyDown={handleKeyDown}
						value={password}
						onChange={(e: any) => setPassword(e.target.value)}
						type="password"
					/>
					<p className="mt-1 text-sm text-red-500">{passwordError}</p>
					<Button className="mt-3 mb-2 w-full" onClick={() => requestLogin()} loading={pendingLogin}>
						Enter
					</Button>
				</div>
			</Container>
		</div>
	);
}
