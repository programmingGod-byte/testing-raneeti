// app/not-found.tsx
export const metadata = {
  title: "404 - Page Not Found",
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="mt-4 text-lg">Sorry, this page could not be found.</p>
    </div>
  )
}
