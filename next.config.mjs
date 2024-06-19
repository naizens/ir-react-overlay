/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "export",
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
	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.resolve.alias["fs"] = false;
			config.resolve.alias["path"] = false;
			config.resolve.alias["electron"] = false;
		}
		return config;
	},
};

export default nextConfig;
