import RefundForm from "@/components/RefundForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              AI Refund Agent
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Submit and track refund requests.
            </p>
          </div>

          <a
            href="/admin"
            className="bg-black text-white px-4 py-2 rounded-lg"
          >
            Admin Dashboard
          </a>
        </header>

        <section>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Create Refund
            </h2>

            <RefundForm />
          </div>
        </section>

      </div>
    </main>
  );
}