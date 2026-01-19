'use client'

import React, { useState } from 'react'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form submitted:', formData)
    alert('Thank you for your message! We will get back to you soon.')
    setFormData({ name: '', email: '', phone: '', message: '' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <section className="py-20 bg-coffee-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h2>
          <p className="text-xl text-coffee-200 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-coffee-800 p-3 rounded-lg">
                  <MapPin className="w-6 h-6 text-coffee-300" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Address</h4>
                  <p className="text-coffee-300">
                    Sarola, Jhajjar, Haryana, India (124108)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-coffee-800 p-3 rounded-lg">
                  <Phone className="w-6 h-6 text-coffee-300" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Phone</h4>
                  <p className="text-coffee-300">+91 8222073728</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-coffee-800 p-3 rounded-lg">
                  <Mail className="w-6 h-6 text-coffee-300" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Email</h4>
                  <p className="text-coffee-300">gvnaturals11@gmail.com</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-coffee-800 rounded-lg">
              <h4 className="font-semibold mb-2">Business Hours</h4>
              <p className="text-coffee-300">
                Monday - Friday: 9:00 AM - 6:00 PM<br />
                Saturday: 10:00 AM - 4:00 PM<br />
                Sunday: Closed
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-coffee-800 p-8 rounded-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className="bg-white text-coffee-900"
              />
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-white text-coffee-900"
              />
              <Input
                label="Phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="bg-white text-coffee-900"
              />
              <div>
                <label className="block text-sm font-medium mb-1">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent bg-white text-coffee-900 border-gray-300"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-coffee-600 hover:bg-coffee-700 text-white py-3 text-lg font-semibold flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

