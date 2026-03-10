import { useState } from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaInstagram } from "react-icons/fa";
import { toast } from "sonner";

const ContactUs = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    // Simulate sending
    setTimeout(() => {
      setSending(false);
      toast.success("Message sent! We'll get back to you soon.");
      setForm({ name: "", email: "", message: "" });
    }, 1000);
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Have a question, custom order request, or just want to say hello? We'd love to hear from you.
        </p>
      </div>

      <div className="max-w-5xl mx-auto py-16 px-4 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border p-3 rounded"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border p-3 rounded"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                required
                rows="5"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full border p-3 rounded"
                placeholder="Tell us about your custom request or question..."
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition disabled:opacity-50"
            >
              {sending ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                <FaEnvelope />
              </div>
              <div>
                <h3 className="font-semibold">Email</h3>
                <p className="text-gray-600">hello@karigari.com</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-100 text-green-600 rounded-full">
                <FaPhone />
              </div>
              <div>
                <h3 className="font-semibold">Phone</h3>
                <p className="text-gray-600">+91 99999 99999</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-100 text-red-500 rounded-full">
                <FaMapMarkerAlt />
              </div>
              <div>
                <h3 className="font-semibold">Location</h3>
                <p className="text-gray-600">Jaipur, Rajasthan, India</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-pink-100 text-pink-600 rounded-full">
                <FaInstagram />
              </div>
              <div>
                <h3 className="font-semibold">Instagram</h3>
                <p className="text-gray-600">@karigari.crochet</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
