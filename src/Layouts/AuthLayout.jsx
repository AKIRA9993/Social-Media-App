import React from 'react'
import { Outlet, Link } from 'react-router-dom'

export default function AuthLayout() {
  return <>
    <div className="min-h-screen  from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
      {/* Header */}
      <header className="p-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="text-2xl font-bold text-primary">ACM</div>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-sm text-gray-500">
        © 2024 ACME. All rights reserved.
      </footer>
    </div>
  </>
}