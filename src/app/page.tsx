import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="glass sticky top-0 z-50 w-full border-b border-gray-800">
        <div className="container flex justify-between items-center py-sm">
          <div className="font-bold text-xl tracking-tighter">MDC.</div>
          <div className="flex gap-md">
            <Link href="/calendar" className="btn btn-outline text-sm border-none">Schedule</Link>
            <Link href="/track" className="btn btn-outline text-sm">Track Request</Link>
            <Link href="/book" className="btn btn-primary text-sm">Book Us</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center text-center container py-3xl animate-fade-in">
        <h1 className="text-5xl md:text-7xl font-bold mb-md tracking-tighter">
          Elevate Your Event
        </h1>
        <p className="text-xl text-secondary max-w-2xl mb-xl">
          The Mapúa Dance Community brings unparalleled energy, creativity, and precision to every performance. 
          Book our award-winning team for your next big event.
        </p>
        <div className="flex gap-md">
          <Link href="/book" className="btn btn-primary text-lg">Start Proposal</Link>
          <Link href="/portfolio" className="btn btn-outline text-lg">View Portfolio</Link>
        </div>
      </section>

      {/* Guidelines Section */}
      <section className="bg-secondary py-3xl border-y border-gray-800">
        <div className="container">
          <h2 className="text-3xl font-bold mb-xl text-center">Booking Guidelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            <div className="card">
              <h3 className="text-xl font-bold mb-sm">1. Submit Proposal</h3>
              <p className="text-secondary text-sm">
                Provide comprehensive details about your event, the creative theme you envision, and your value proposition for MDC.
              </p>
            </div>
            <div className="card">
              <h3 className="text-xl font-bold mb-sm">2. Board Review</h3>
              <p className="text-secondary text-sm">
                Our executive board will evaluate your proposal based on our current schedule, alignment with our artistic direction, and mutual benefit.
              </p>
            </div>
            <div className="card">
              <h3 className="text-xl font-bold mb-sm">3. Confirmation</h3>
              <p className="text-secondary text-sm">
                Once approved, you'll receive a confirmation and we'll begin the coordination for rehearsals and technical requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-lg text-center text-secondary text-sm">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Mapúa Dance Community. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
