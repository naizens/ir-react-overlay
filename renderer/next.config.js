/** @type {import('next').NextConfig} */
module.exports = {
	output: "export",
	distDir: process.env.NODE_ENV === "production" ? "../app" : ".next",
	trailingSlash: true,
	images: {
		unoptimized: true,
	},
	async rewrites() {
		return [
			{
				source: "/api/:path*",
				destination: "http://localhost:3001/api/:path*", // Proxy to Flask API
			},
		];
	},
	webpack: (config) => {
		return config;
	},
};
