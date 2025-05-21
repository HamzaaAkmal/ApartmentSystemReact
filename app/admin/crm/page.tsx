"use client"

import { useState } from "react"
import { getAllLeads } from "@/lib/data"
import type { Lead, LeadSource, LeadStatus } from "@/lib/types"

export default function CRMDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showAddLeadDialog, setShowAddLeadDialog] = useState(false)
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false)
  const [leads, setLeads] = useState<Lead[]>(getAllLeads())
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>(getAllLeads())
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all")
  const [sourceFilter, setSourceFilter] = useState<LeadSource | "all">("all")
  
  // New lead form state
  const [newLead, setNewLead] = useState<{
    name: string;
    email: string;
    phone: string;
    interest: string;
    source: LeadSource;
    notes: string;
  }>({
    name: "",
    email: "",
    phone: "",
    interest: "",
    source: "website",
    notes: "",
  })
  
  // New task form state
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    assignedTo: "",
    leadId: "",
  })
  
  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    filterLeads(query, statusFilter, sourceFilter)
  }
  
  // Handle filter changes
  const handleStatusFilterChange = (status: LeadStatus | "all") => {
    setStatusFilter(status)
    filterLeads(searchQuery, status, sourceFilter)
  }
  
  const handleSourceFilterChange = (source: LeadSource | "all") => {
    setSourceFilter(source)
    filterLeads(searchQuery, statusFilter, source)
  }
  
  // Filter leads based on search query and filters
  const filterLeads = (query: string, status: LeadStatus | "all", source: LeadSource | "all") => {
    let filtered = getAllLeads()
    
    // Apply search query filter
    if (query) {
      filtered = filtered.filter(lead => 
        lead.name.toLowerCase().includes(query.toLowerCase()) ||
        lead.email.toLowerCase().includes(query.toLowerCase()) ||
        lead.phone.includes(query) ||
        lead.interest.toLowerCase().includes(query.toLowerCase())
      )
    }
    
    // Apply status filter
    if (status !== "all") {
      filtered = filtered.filter(lead => lead.status === status)
    }
    
    // Apply source filter
    if (source !== "all") {
      filtered = filtered.filter(lead => lead.source === source)
    }
    
    setFilteredLeads(filtered)
  }
  
  // Handle adding a new lead
  const handleAddLead = () => {
    const newLeadId = (leads.length + 1).toString()
    const lead: Lead = {
      id: newLeadId,
      name: newLead.name,
      email: newLead.email,
      phone: newLead.phone,
      interest: newLead.interest,
      source: newLead.source,
      status: "new",
      notes: newLead.notes,
      lastContact: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    // Add to leads array
    const updatedLeads = [...leads, lead]
