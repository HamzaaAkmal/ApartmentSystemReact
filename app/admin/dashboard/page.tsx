"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

// Custom Hooks
import { useAuth } from "../../../context/AuthContext"; 
import { useCrud as useClientCrud } from "@/lib/hooks/use-crud"; 
import { useFinance } from "@/lib/hooks/use-finance"; 
import { usePayments } from "@/lib/hooks/use-payments";
import { useApartments } from "@/lib/hooks/use-apartments"; 
import { useBuildings } from "@/lib/hooks/use-buildings"; 

// Types
import type { 
  Account, FinancialTransaction, Client, Apartment, Payment, Currency, 
  Building as BuildingType
} from "@/lib/types";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchBar } from "@/components/search-bar";
import { ClientDialog } from "@/components/dialogs/client-dialog";
import { ApartmentDialog } from "@/components/dialogs/apartment-dialog";
import { PaymentDialog } from "@/components/dialogs/payment-dialog";
import { TransactionDialog } from "@/components/dialogs/transaction-dialog";
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog";
import { ViewClientDialog } from "@/components/dialogs/view-client-dialog";
import { ViewApartmentDialog } from "@/components/dialogs/view-apartment-dialog";
import { AdBannerCarousel } from "@/components/ad-banner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Icons
import {
  BarChart3, Building, CreditCard, LayoutDashboard, LogOut, Menu, MessageSquare, Settings, Users, X, Eye, Edit, Trash2, Phone, Plus, DollarSign, TrendingUp, TrendingDown, ListFilter, Repeat, Loader2, AlertTriangle, Briefcase, CalendarDays, ListChecks
} from "lucide-react";

// Helpers (formatCurrency, systemSettings might still be used from here)
import { formatCurrency, systemSettings } from "@/lib/data";
import AdminRouteGuard from '@/components/auth/AdminRouteGuard'; // Added

// Constants
const CONSTRUCTION_ACCOUNT_ID = "construction_main_usd";
const CLIENT_FINANCE_ACCOUNT_ID = "client_finance_usd";
const DEFAULT_CURRENCY: Currency = "USD";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, currentUser } = useAuth();

  // Data Hooks
  const { items: clients, loading: clientsLoading, error: clientsError, create: createClient, update: updateClient, remove: removeClient } = useClientCrud();
  const { apartments, loading: apartmentsLoading, error: apartmentsError, createApartment, updateApartment, deleteApartment } = useApartments();
  const { buildings, loading: buildingsLoading, error: buildingsError } = useBuildings();
  const { payments, loading: paymentsLoading, error: paymentsError, createPayment: createPaymentDoc, updatePayment: updatePaymentDoc, deletePayment: deletePaymentDoc } = usePayments();
  const { accounts, transactionsForSelectedAccount, loadingAccounts, loadingTransactions, errorAccounts, errorTransactions, createAccount, addFinancialTransaction, fetchTransactionsForAccount } = useFinance();

  // Dialog States
  const [addClientDialogOpen, setAddClientDialogOpen] = useState(false);
  const [editClientDialogOpen, setEditClientDialogOpen] = useState(false);
  const [viewClientDialogOpen, setViewClientDialogOpen] = useState(false);
  const [deleteClientDialogOpen, setDeleteClientDialogOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [clientToView, setClientToView] = useState<Client | null | undefined>(null);

  const [addApartmentDialogOpen, setAddApartmentDialogOpen] = useState(false);
  const [editApartmentDialogOpen, setEditApartmentDialogOpen] = useState(false);
  const [viewApartmentDialogOpen, setViewApartmentDialogOpen] = useState(false);
  const [deleteApartmentDialogOpen, setDeleteApartmentDialogOpen] = useState(false);
  const [selectedApartmentId, setSelectedApartmentId] = useState<string | null>(null);
  const [apartmentToView, setApartmentToView] = useState<Apartment | null | undefined>(null);

  const [addPaymentDialogOpen, setAddPaymentDialogOpen] = useState(false);
  
  const [showTransactionDialog, setShowTransactionDialog] = useState(false);
  const [transactionDialogAccountId, setTransactionDialogAccountId] = useState<string | null>(null);
  const [transactionDialogAccountType, setTransactionDialogAccountType] = useState<"construction" | "finance" | undefined>(undefined);

  // Filtered Data States
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [filteredApartments, setFilteredApartments] = useState<Apartment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFinanceAccountId, setSelectedFinanceAccountId] = useState<string | null>(CLIENT_FINANCE_ACCOUNT_ID);

  // Auto-create main accounts
   useEffect(() => {
    if (!loadingAccounts && accounts) { 
      const defaultAccounts = [
        { id: CONSTRUCTION_ACCOUNT_ID, name: "Construction Main (USD)", type: "construction", currency: "USD" as Currency },
        { id: CLIENT_FINANCE_ACCOUNT_ID, name: "Client Revenue (USD)", type: "client_finance", currency: "USD" as Currency }
      ];
      let accountsCreated = false;
      defaultAccounts.forEach(async (accData) => {
        const exists = accounts.some(acc => acc.type === accData.type && acc.currency === accData.currency && acc.name === accData.name);
        if (!exists) {
          try {
            console.log(`Attempting to create account: ${accData.name}`);
            await createAccount({ name: accData.name, type: accData.type, currency: accData.currency });
            accountsCreated = true;
          } catch (error) { console.error(`Error auto-creating account ${accData.name}:`, error); }
        }
      });
    }
  }, [accounts, loadingAccounts, createAccount]);
  
  useEffect(() => {
    if (selectedFinanceAccountId) fetchTransactionsForAccount(selectedFinanceAccountId);
  }, [selectedFinanceAccountId, fetchTransactionsForAccount, accounts]);

  // Filtering Logic
  const handleSearch = (query: string) => setSearchQuery(query);

  useEffect(() => setFilteredClients(clients), [clients]);
  useEffect(() => setFilteredApartments(apartments), [apartments]);
  useEffect(() => setFilteredPayments(payments), [payments]);

  useEffect(() => {
    const lcQuery = searchQuery.toLowerCase();
    if (searchQuery) {
      setFilteredClients(clients.filter(c => c.name.toLowerCase().includes(lcQuery) || c.email.toLowerCase().includes(lcQuery) || (c.phone && c.phone.includes(searchQuery))));
      setFilteredApartments(apartments.filter(a => {
        const buildingName = buildings.find(b => b.id === a.buildingId)?.name || "";
        return a.number.toLowerCase().includes(lcQuery) || a.type.toLowerCase().includes(lcQuery) || buildingName.toLowerCase().includes(lcQuery);
      }));
      setFilteredPayments(payments.filter(p => {
        const clientName = clients.find(c => c.id === p.clientId)?.name || "";
        const aptNumber = apartments.find(a => a.id === p.apartmentId)?.number || "";
        return clientName.toLowerCase().includes(lcQuery) || aptNumber.toLowerCase().includes(lcQuery) || p.status.toLowerCase().includes(lcQuery) || p.method.toLowerCase().includes(lcQuery);
      }));
    } else {
      setFilteredClients(clients);
      setFilteredApartments(apartments);
      setFilteredPayments(payments);
    }
  }, [searchQuery, clients, apartments, payments, buildings]);

  // CRUD Handlers
  const handleAddClient = async (data: Omit<Client, "id"| "createdAt"| "updatedAt">) => { try { await createClient(data); } catch (e) { console.error(e); alert("Error.");}};
  const handleEditClient = async (data: Omit<Client, "id"| "createdAt"| "updatedAt">) => { if (selectedClientId) try { await updateClient(selectedClientId, data as Partial<Client>); } catch (e) { console.error(e); alert("Error.");}};
  const handleDeleteClient = async () => { if (selectedClientId) try { await removeClient(selectedClientId); setSelectedClientId(null); } catch (e) { console.error(e); alert("Error.");}};

  const handleAddApartment = async (data: Omit<Apartment, "id"| "createdAt"| "updatedAt">) => { try { await createApartment(data); } catch (e) { console.error(e); alert("Error adding apartment.");}};
  const handleEditApartment = async (data: Omit<Apartment, "id"| "createdAt"| "updatedAt">) => { 
    if (selectedApartmentId) {
      const { id, createdAt, updatedAt, ...updateData } = data as Apartment; 
      try { await updateApartment(selectedApartmentId, updateData); } catch (e) { console.error(e); alert("Error editing apartment.");}
    }
  };
  const handleDeleteApartment = async () => { if (selectedApartmentId) try { await deleteApartment(selectedApartmentId); setSelectedApartmentId(null); } catch (e) { console.error(e); alert("Error deleting apartment.");}};
  
  const handleAddPayment = async (data: Omit<Payment, "id"| "createdAt"| "updatedAt">) => {
    try { const newP = await createPaymentDoc(data); if (newP && newP.status === "paid") { await addFinancialTransaction({ accountId: CLIENT_FINANCE_ACCOUNT_ID, type: "income", category: "client_payment", description: `Payment for Apt ${newP.apartmentId}`, amount: newP.amount, currency: newP.currency, transactionDate: newP.paidDate||new Date(), relatedPaymentId: newP.id });}} catch (e) { console.error(e); alert("Error.");}
  };
  const handleMarkPaymentPaid = async (p: Payment) => {
    if (p.status!=="paid") try { await updatePaymentDoc(p.id, {status:"paid", paidDate:new Date()}); await addFinancialTransaction({accountId:CLIENT_FINANCE_ACCOUNT_ID, type:"income", category:"client_payment", description:`Payment ID: ${p.id}`, amount:p.amount, currency:p.currency, transactionDate:new Date(), relatedPaymentId:p.id});} catch(e){console.error(e);alert("Error.")}
  };
  const handleDeletePayment = async (id: string) => { if(confirm("Delete payment? This may affect financial records.")) try {await deletePaymentDoc(id);}catch(e){console.error(e);alert("Error.")}};

  const handleAddGenericTransaction = async (data: any) => { try {await addFinancialTransaction(data);}catch(e){console.error(e);alert("Error.")}};
  
  const constructionMainAccount = accounts.find(acc => acc.type === 'construction' && acc.currency === 'USD'); 
  const clientFinanceMainAccount = accounts.find(acc => acc.type === 'client_finance' && acc.currency === 'USD');

  return (
    <AdminRouteGuard>
      <div className="flex min-h-screen flex-col bg-gray-100">
        <AdBannerCarousel />
        <div className="flex flex-1 flex-col md:flex-row">
        <Button variant="ghost" size="icon" className="absolute left-4 top-4 z-50 md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}><X className={`${sidebarOpen ? "" : "hidden"} h-6 w-6`} /><Menu className={`${sidebarOpen ? "hidden" : ""} h-6 w-6`} /></Button>
        <div className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-green-800 p-4 text-white transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:block`}>
          <div className="flex h-full flex-col">
            <div className="mb-8 flex items-center gap-2 px-2"><Image src="/placeholder.svg?height=40&width=40" alt="Logo" width={40} height={40} className="rounded-md bg-white p-1"/><span className="text-xl font-bold">ApartmentPro</span></div>
            <nav className="flex-1 space-y-1">
              <Link href="/admin/dashboard" className="flex items-center rounded-md bg-green-700 px-4 py-3 text-sm font-medium"><LayoutDashboard className="mr-3 h-5 w-5" />Dashboard</Link>
              <Link href="/admin/crm" className="flex items-center rounded-md px-4 py-3 text-sm font-medium text-green-100 hover:bg-green-700"><Briefcase className="mr-3 h-5 w-5" />CRM</Link>
              <Link href="/admin/clients" className="flex items-center rounded-md px-4 py-3 text-sm font-medium text-green-100 hover:bg-green-700"><Users className="mr-3 h-5 w-5" />Clients</Link>
              <Link href="/admin/apartments" className="flex items-center rounded-md px-4 py-3 text-sm font-medium text-green-100 hover:bg-green-700"><Building className="mr-3 h-5 w-5" />Apartments</Link>
              <Link href="/admin/payments" className="flex items-center rounded-md px-4 py-3 text-sm font-medium text-green-100 hover:bg-green-700"><CreditCard className="mr-3 h-5 w-5" />Payments</Link>
              <Link href="/admin/analytics" className="flex items-center rounded-md px-4 py-3 text-sm font-medium text-green-100 hover:bg-green-700"><BarChart3 className="mr-3 h-5 w-5" />Analytics</Link>
              <Link href="/admin/settings" className="flex items-center rounded-md px-4 py-3 text-sm font-medium text-green-100 hover:bg-green-700"><Settings className="mr-3 h-5 w-5" />Settings</Link>
            </nav>
            <div className="mt-auto border-t border-green-700 pt-4"><Button variant="ghost" className="flex w-full items-center justify-start" onClick={async () => { await logout(); }}><LogOut className="mr-3 h-5 w-5" />Logout</Button></div>
          </div>
        </div>

        <div className="flex-1 p-4 md:p-6">
          <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div><h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1><p className="text-gray-500">Welcome back, {currentUser?.email || "Admin"}</p></div>
            <div className="flex flex-col gap-2 sm:flex-row"><SearchBar placeholder="Search across system..." onSearch={handleSearch} /></div>
          </header>

          <Tabs defaultValue="overview">
            <TabsList className="mb-4 flex-wrap"><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="apartments">Apartments</TabsTrigger><TabsTrigger value="clients">Clients</TabsTrigger><TabsTrigger value="payments">Payments</TabsTrigger><TabsTrigger value="finance">Finance</TabsTrigger></TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card><CardHeader className="pb-2"><CardDescription>Total Buildings</CardDescription><CardTitle className="text-4xl">{buildingsLoading ? <Loader2 className="h-8 w-8 animate-spin"/> : buildings.length}</CardTitle></CardHeader><CardContent><div className="text-xs text-gray-500">From Firestore</div></CardContent></Card>
                <Card><CardHeader className="pb-2"><CardDescription>Available Apartments</CardDescription><CardTitle className="text-4xl">{apartmentsLoading ? <Loader2 className="h-8 w-8 animate-spin"/> : apartments.filter(apt => apt.status === "available").length}</CardTitle></CardHeader><CardContent><div className="text-xs text-gray-500">From Firestore</div></CardContent></Card>
                <Card><CardHeader className="pb-2"><CardDescription>Total Clients</CardDescription><CardTitle className="text-4xl">{clientsLoading ? <Loader2 className="h-8 w-8 animate-spin" /> : clients.length}</CardTitle></CardHeader><CardContent><div className="text-xs text-gray-500">From Firestore</div></CardContent></Card>
                <Card><CardHeader className="pb-2"><CardDescription>Client Finance (USD)</CardDescription>{loadingAccounts ? <Loader2 className="h-8 w-8 animate-spin"/> : clientFinanceMainAccount ? <CardTitle className="text-4xl">{formatCurrency(clientFinanceMainAccount.balance, clientFinanceMainAccount.currency)}</CardTitle> : <CardTitle className="text-sm">N/A</CardTitle>}</CardHeader><CardContent><div className="text-xs text-gray-500">From Firestore</div></CardContent></Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader><CardTitle>Recent Financial Activities</CardTitle><CardDescription>For {accounts.find(a=>a.id === selectedFinanceAccountId)?.name || "Selected Account"}</CardDescription></CardHeader>
                  <CardContent>
                    {loadingTransactions && <div className="flex items-center"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Loading...</div>}
                    {errorTransactions && <p className="text-red-500">Error: {errorTransactions}</p>}
                    {!loadingTransactions && transactionsForSelectedAccount.length === 0 && <p>No transactions.</p>}
                    <div className="space-y-3">{transactionsForSelectedAccount.slice(0,5).map((tx) => (<div key={tx.id} className="flex items-center gap-3"><div className={`p-2 rounded-full ${tx.type === "income" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{tx.type === "income" ? <TrendingUp size={18}/> : <TrendingDown size={18}/>}</div><div><p className="font-medium text-sm">{tx.description}</p><p className="text-xs text-gray-500">{tx.category} | {formatCurrency(tx.amount, tx.currency)} | {new Date(tx.transactionDate).toLocaleDateString()}</p></div></div>))}</div>
                  </CardContent>
                </Card>
                <Card><CardHeader><CardTitle>Payment Status Summary</CardTitle></CardHeader><CardContent>{paymentsLoading ? <Loader2 className="h-6 w-6 animate-spin"/> : <p className="text-sm text-gray-500">{`Total Payments: ${payments.length} (Paid: ${payments.filter(p=>p.status==='paid').length}, Pending: ${payments.filter(p=>p.status==='pending').length}, Overdue: ${payments.filter(p=>p.status==='overdue').length})`}</p>}</CardContent></Card>
              </div>
            </TabsContent>

            <TabsContent value="apartments" className="space-y-4">
              <Card>
                <CardHeader className="flex-row items-center justify-between"><CardTitle>Apartments</CardTitle><Button onClick={() => setAddApartmentDialogOpen(true)}><PlusCircle className="mr-2 h-4 w-4"/>Add Apartment</Button></CardHeader>
                <CardContent>
                  {apartmentsLoading && <div className="flex items-center justify-center py-4"><Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading apartments...</div>}
                  {apartmentsError && <div className="text-red-500 py-4">Error: {apartmentsError}</div>}
                  {!apartmentsLoading && !apartmentsError && (<div className="overflow-x-auto"><table className="w-full"><thead><tr><th className="p-2 text-left">Building</th><th className="p-2 text-left">Unit #</th><th className="p-2 text-left">Type</th><th className="p-2 text-left">Price</th><th className="p-2 text-left">Status</th><th className="p-2 text-right">Actions</th></tr></thead><tbody>
                    {filteredApartments.map(apt => { const buildingName = buildingsLoading ? "..." : (buildings.find((b: BuildingType) => b.id === apt.buildingId)?.name || "N/A"); return (<tr key={apt.id} className="border-b"><td className="p-2">{buildingName}</td><td className="p-2">{apt.number}</td><td className="p-2">{apt.type}</td><td className="p-2">{formatCurrency(apt.price, DEFAULT_CURRENCY)}</td><td className="p-2">{apt.status}</td><td className="p-2 text-right"><Button variant="ghost" size="icon" onClick={()=>{setSelectedApartmentId(apt.id); setApartmentToView(apt); setViewApartmentDialogOpen(true);}}><Eye size={18}/></Button><Button variant="ghost" size="icon" onClick={()=>{setSelectedApartmentId(apt.id); setEditApartmentDialogOpen(true);}}><Edit2 size={18}/></Button><Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={()=>{setSelectedApartmentId(apt.id); setDeleteApartmentDialogOpen(true);}}><Trash2 size={18}/></Button></td></tr>);})}
                  </tbody></table></div>)}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="clients" className="space-y-4">
              <Card>
                <CardHeader className="flex-row items-center justify-between"><CardTitle>Clients</CardTitle><Button onClick={() => setAddClientDialogOpen(true)}><PlusCircle className="mr-2 h-4 w-4"/>Add Client</Button></CardHeader>
                <CardContent>
                  {clientsLoading && <div className="flex items-center justify-center py-4"><Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading clients...</div>}
                  {clientsError && <div className="text-red-500 py-4">Error: {clientsError}</div>}
                  {!clientsLoading && !clientsError && (<div className="overflow-x-auto"><table className="w-full"><thead><tr><th className="p-2 text-left">Name</th><th className="p-2 text-left">Email</th><th className="p-2 text-left">Phone</th><th className="p-2 text-left">Type</th><th className="p-2 text-left">Status</th><th className="p-2 text-right">Actions</th></tr></thead><tbody>
                    {filteredClients.map(client => (<tr key={client.id} className="border-b"><td className="p-2">{client.name}</td><td className="p-2">{client.email}</td><td className="p-2">{client.phone}</td><td className="p-2">{client.type}</td><td className="p-2">{client.status}</td><td className="p-2 text-right"><Button variant="ghost" size="icon" onClick={()=>{setSelectedClientId(client.id); setClientToView(client); setViewClientDialogOpen(true);}}><Eye size={18}/></Button><Button variant="ghost" size="icon" onClick={()=>{setSelectedClientId(client.id); setEditClientDialogOpen(true);}}><Edit2 size={18}/></Button><Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={()=>{setSelectedClientId(client.id); setDeleteClientDialogOpen(true);}}><Trash2 size={18}/></Button></td></tr>))}
                  </tbody></table></div>)}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments" className="space-y-4">
              <Card>
                <CardHeader className="flex-row items-center justify-between"><CardTitle>Payments</CardTitle><Button onClick={() => setAddPaymentDialogOpen(true)}><PlusCircle className="mr-2 h-4 w-4"/>Add Payment</Button></CardHeader>
                <CardContent>
                  {paymentsLoading && <div className="flex items-center justify-center py-4"><Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading payments...</div>}
                  {paymentsError && <div className="text-red-500 py-4">Error: {paymentsError}</div>}
                  {!paymentsLoading && !paymentsError && (<div className="overflow-x-auto"><table className="w-full"><thead><tr><th className="p-2 text-left">Client</th><th className="p-2 text-left">Apartment</th><th className="p-2 text-left">Amount</th><th className="p-2 text-left">Status</th><th className="p-2 text-left">Due Date</th><th className="p-2 text-right">Actions</th></tr></thead><tbody>
                    {filteredPayments.map(payment => { const client = clients.find(c=>c.id === payment.clientId); const apt = apartments.find(a=>a.id === payment.apartmentId); return (<tr key={payment.id} className="border-b"><td className="p-2">{client?.name || "N/A"}</td><td className="p-2">{apt?.number || "N/A"}</td><td className="p-2">{formatCurrency(payment.amount, payment.currency)}</td><td className="p-2">{payment.status}</td><td className="p-2">{new Date(payment.dueDate).toLocaleDateString()}</td><td className="p-2 text-right">{payment.status !== 'paid' && (<Button size="sm" variant="outline" onClick={()=>handleMarkPaymentPaid(payment)}>Mark Paid</Button>)}<Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={()=>handleDeletePayment(payment.id)}><Trash2 size={18}/></Button></td></tr>);})}
                  </tbody></table></div>)}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="finance" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card><CardHeader className="flex-row items-center justify-between"><CardTitle>Construction Account</CardTitle><Button size="sm" onClick={() => { if(constructionMainAccount) {setTransactionDialogAccountId(constructionMainAccount.id); setTransactionDialogAccountType("construction"); setShowTransactionDialog(true); } else {alert("Construction account not found/loaded.")} }}><PlusCircle className="mr-2 h-4 w-4"/>Add Tx</Button></CardHeader><CardContent>{loadingAccounts ? <Loader2 className="h-6 w-6 animate-spin"/> : constructionMainAccount ? <p className="text-2xl font-bold">{formatCurrency(constructionMainAccount.balance, constructionMainAccount.currency)}</p> : <p>N/A</p>}</CardContent></Card>
                <Card><CardHeader className="flex-row items-center justify-between"><CardTitle>Client Finance Account</CardTitle><Button size="sm" onClick={() => { if(clientFinanceMainAccount) {setTransactionDialogAccountId(clientFinanceMainAccount.id); setTransactionDialogAccountType("finance"); setShowTransactionDialog(true); } else {alert("Client Finance account not found/loaded.")} }}><PlusCircle className="mr-2 h-4 w-4"/>Add Tx</Button></CardHeader><CardContent>{loadingAccounts ? <Loader2 className="h-6 w-6 animate-spin"/> : clientFinanceMainAccount ? <p className="text-2xl font-bold">{formatCurrency(clientFinanceMainAccount.balance, clientFinanceMainAccount.currency)}</p> : <p>N/A</p>}</CardContent></Card>
              </div>
              <Card>
                <CardHeader className="flex-row items-center justify-between"><CardTitle>Transaction History</CardTitle>
                  <Select onValueChange={(value) => setSelectedFinanceAccountId(value)} defaultValue={selectedFinanceAccountId || undefined}>
                    <SelectTrigger className="w-auto"><SelectValue placeholder="Select Account" /></SelectTrigger>
                    <SelectContent>{accounts.map(acc => (<SelectItem key={acc.id} value={acc.id}>{acc.name} ({acc.currency})</SelectItem>))}</SelectContent>
                  </Select>
                </CardHeader>
                <CardContent>
                  {loadingTransactions && <div className="flex items-center justify-center py-4"><Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading transactions...</div>}
                  {errorTransactions && <div className="text-red-500 py-4">Error: {errorTransactions}</div>}
                  {!loadingTransactions && !errorTransactions && transactionsForSelectedAccount.length === 0 && <p>No transactions for this account.</p>}
                  {!loadingTransactions && !errorTransactions && (<div className="overflow-x-auto"><table className="w-full"><thead><tr><th className="p-2 text-left">Date</th><th className="p-2 text-left">Description</th><th className="p-2 text-left">Category</th><th className="p-2 text-left">Type</th><th className="p-2 text-right">Amount</th></tr></thead><tbody>
                    {transactionsForSelectedAccount.map(tx => (<tr key={tx.id} className="border-b"><td className="p-2">{new Date(tx.transactionDate).toLocaleDateString()}</td><td className="p-2">{tx.description}</td><td className="p-2">{tx.category}</td><td className={`p-2 capitalize ${tx.type==='income'?'text-green-600':'text-red-600'}`}>{tx.type}</td><td className={`p-2 text-right font-medium ${tx.type==='income'?'text-green-600':'text-red-600'}`}>{formatCurrency(tx.amount, tx.currency)}</td></tr>))}
                  </tbody></table></div>)}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Dialogs */}
      <ClientDialog open={addClientDialogOpen} onOpenChange={setAddClientDialogOpen} onSave={handleAddClient} title="Add New Client"/>
      <ClientDialog open={editClientDialogOpen} onOpenChange={setEditClientDialogOpen} onSave={handleEditClient} client={selectedClientId ? clients.find(c => c.id === selectedClientId) : undefined} title="Edit Client"/>
      <ViewClientDialog open={viewClientDialogOpen} onOpenChange={setViewClientDialogOpen} client={clientToView} onEdit={() => { setViewClientDialogOpen(false); setSelectedClientId(clientToView?.id || null); setEditClientDialogOpen(true);}} onDelete={() => { setViewClientDialogOpen(false); setSelectedClientId(clientToView?.id || null); setDeleteClientDialogOpen(true);}} currency={DEFAULT_CURRENCY}/>
      <ConfirmDialog open={deleteClientDialogOpen} onOpenChange={setDeleteClientDialogOpen} onConfirm={handleDeleteClient} title="Delete Client" description="Are you sure?" confirmText="Delete" variant="destructive"/>
      
      <ApartmentDialog open={addApartmentDialogOpen} onOpenChange={setAddApartmentDialogOpen} onSave={handleAddApartment} title="Add New Apartment" buildings={buildings} />
      <ApartmentDialog open={editApartmentDialogOpen} onOpenChange={setEditApartmentDialogOpen} onSave={handleEditApartment} apartment={selectedApartmentId ? apartments.find(a => a.id === selectedApartmentId) : undefined} title="Edit Apartment" buildings={buildings} />
      <ViewApartmentDialog open={viewApartmentDialogOpen} onOpenChange={setViewApartmentDialogOpen} apartment={apartmentToView} onEdit={() => { setViewApartmentDialogOpen(false); setSelectedApartmentId(apartmentToView?.id || null); setEditApartmentDialogOpen(true);}} onDelete={() => { setViewApartmentDialogOpen(false); setSelectedApartmentId(apartmentToView?.id || null); setDeleteApartmentDialogOpen(true);}} currency={DEFAULT_CURRENCY}/>
      <ConfirmDialog open={deleteApartmentDialogOpen} onOpenChange={setDeleteApartmentDialogOpen} onConfirm={handleDeleteApartment} title="Delete Apartment" description="Are you sure?" confirmText="Delete" variant="destructive"/>
      
      <PaymentDialog open={addPaymentDialogOpen} onOpenChange={setAddPaymentDialogOpen} onSave={handleAddPayment} title="Add New Payment" clients={clients} apartments={apartments} />
      
      <TransactionDialog
        open={showTransactionDialog}
        onOpenChange={setShowTransactionDialog}
        onSave={(data) => { if (transactionDialogAccountId) { handleAddGenericTransaction({ accountId: transactionDialogAccountId, ...data }); } }}
        title={`Add Transaction to ${transactionDialogAccountType === 'construction' ? 'Construction' : 'Finance'} Account`}
        description="Record a new transaction."
        accountType={transactionDialogAccountType || undefined}
      />
      </div>
    </AdminRouteGuard>
  );
}
