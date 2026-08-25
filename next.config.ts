import type {NextConfig} from "next"

const nextConfig: NextConfig = {
    /* config options here */
    reactCompiler: true,
    output: "standalone",
    experimental: {
        serverActions: {
            bodySizeLimit: "3mb",
        },
    },
}

export default nextConfig
