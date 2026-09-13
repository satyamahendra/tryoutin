import type {NextConfig} from "next"

const securityHeaders = [
    {key: "X-Frame-Options", value: "DENY"},
    {key: "X-Content-Type-Options", value: "nosniff"},
    {key: "Referrer-Policy", value: "strict-origin-when-cross-origin"},
    {key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()"},
]

if (process.env.NODE_ENV === "production") {
    securityHeaders.push({key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload"})
}

const nextConfig: NextConfig = {
    /* config options here */
    reactCompiler: true,
    output: "standalone",
    experimental: {
        serverActions: {
            bodySizeLimit: "5mb",
        },
    },
    // ponytail: hardened headers shipped; CSP intentionally omitted — the app relies
    // on inline styles/scripts, so a strict CSP would break rendering until cleaned.
    async headers() {
        return [{source: "/:path*", headers: securityHeaders}]
    },
}

export default nextConfig