export default function getRootUrl() {
    const PORT = process.env.PORT || 5000
    const dev = process.env.NODE_ENV !== 'production'
    const ROOT_URL = dev ? `http://localhost:${PORT}` : 'https://client-connect.tech'
    return ROOT_URL
}