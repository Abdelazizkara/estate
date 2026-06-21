import { useState } from 'react';
import { Mail, Phone, Star, Search } from 'lucide-react';
import type { Agent } from '../types';

// Mock data for agents
const mockAgents: Agent[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@estate.com',
    phone: '+1 (555) 123-4567',
    avatar: '',
    agency: 'Premium Realty',
    licenseNumber: 'RE12345',
    rating: 4.8,
    reviews: 24,
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@estate.com',
    phone: '+1 (555) 234-5678',
    avatar: '',
    agency: 'Home Finders',
    licenseNumber: 'RE23456',
    rating: 4.9,
    reviews: 31,
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael.b@estate.com',
    phone: '+1 (555) 345-6789',
    avatar: '',
    agency: 'City Properties',
    licenseNumber: 'RE34567',
    rating: 4.7,
    reviews: 18,
  },
];

export function AgentsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAgents = mockAgents.filter((agent) =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.agency?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Find an Agent
          </h1>
          <p className="text-gray-600">
            Connect with experienced real estate professionals
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or agency..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => (
            <div
              key={agent.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
            >
              <div className="text-center mb-4">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-3xl font-bold text-white">
                    {agent.name[0]}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {agent.name}
                </h3>
                {agent.agency && (
                  <p className="text-sm text-gray-600">{agent.agency}</p>
                )}
              </div>

              {/* Rating */}
              {agent.rating && (
                <div className="flex items-center justify-center mb-4">
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <span className="ml-1 font-semibold">{agent.rating}</span>
                  <span className="ml-1 text-gray-500">
                    ({agent.reviews} reviews)
                  </span>
                </div>
              )}

              {/* Contact Info */}
              <div className="space-y-2 mb-4">
                <a
                  href={`tel:${agent.phone}`}
                  className="flex items-center justify-center space-x-2 text-gray-700 hover:text-primary-600 transition"
                >
                  <Phone className="h-4 w-4" />
                  <span className="text-sm">{agent.phone}</span>
                </a>
                <a
                  href={`mailto:${agent.email}`}
                  className="flex items-center justify-center space-x-2 text-gray-700 hover:text-primary-600 transition"
                >
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{agent.email}</span>
                </a>
              </div>

              {/* Contact Button */}
              <button className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition">
                Contact Agent
              </button>
            </div>
          ))}
        </div>

        {filteredAgents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No agents found matching your search</p>
          </div>
        )}
      </div>
    </div>
  );
}
