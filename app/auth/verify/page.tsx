'use client';

import Link from 'next/link';

export default function VerifyPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Check Your Email</h1>
          <p className="text-muted-foreground mb-6">
            We&apos;ve sent a confirmation link to your email address. Please click the link to verify your account and complete the signup process.
          </p>

          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm mb-6">
            <p>If you don&apos;t see the email in your inbox, please check your spam folder.</p>
          </div>

          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </main>
  );
}
