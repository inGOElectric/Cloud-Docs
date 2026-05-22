export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: "Login",
      description: "Create an account or login as a customer or staff member",
    },
    {
      number: 2,
      title: "Service Booking",
      description: "Select your vehicle and choose from available service options",
    },
    {
      number: 3,
      title: "Approval",
      description: "Get your service request approved by our team",
    },
    {
      number: 4,
      title: "Job Card",
      description: "Receive your job card with details and reference number",
    },
    {
      number: 5,
      title: "Service",
      description: "Your vehicle undergoes professional service and inspection",
    },
    {
      number: 6,
      title: "Invoice",
      description: "Get your invoice and service completion certificate",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative bg-white p-8 rounded-lg shadow-md"
            >
              {/* Step Number Circle */}
              <div className="absolute -top-6 left-8 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                {step.number}
              </div>

              {/* Arrow to next step */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2 text-blue-600 text-3xl">
                  →
                </div>
              )}

              <div className="mt-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
