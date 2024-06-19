import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "IR-Overlay",
	description: "Created by Niclas Heide",
};

export default function RootLayout({ children }) {
	return (
		<html lang="de">
			<body className="max-h-screen max-w-screen p-0 m-0">{children}</body>
		</html>
	);
}
