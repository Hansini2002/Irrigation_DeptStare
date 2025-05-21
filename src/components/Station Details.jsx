import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function FillingStationDetail() {
    const { fs_id } = useParams();
    const navigate = useNavigate();
    const [station, setStation] = useState(null);
    const [bills, setBills] = useState([]);
    const [advanceAmount, setAdvanceAmount] = useState(0);
    const [newAdvance, setNewAdvance] = useState('');
    const [remainingBalance, setRemainingBalance] = useState(0);
    const [officers, setOfficers] = useState([]); // New state for officers
    const [newBill, setNewBill] = useState({
        date: new Date().toISOString().split('T')[0],
        officer: '', // Will store officer ID
        officerName: '', // Will store officer name for display
        fuelType: 'petrol',
        quantity: '',
        rate: '',
        amount: ''
    });

    useEffect(() => {
        // Fetch officers list
        const fetchOfficers = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/officer-details', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                
                if (!response.ok) throw new Error('Failed to fetch officers');
                
                const data = await response.json();
                setOfficers(data);
            } catch (error) {
                console.error('Error fetching officers:', error);
                alert('Failed to load officers list');
            }
        };

        // Fetch station details
        const fetchStation = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/filling-stations/${fs_id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                
                if (!response.ok) throw new Error('Failed to fetch station');
                
                const data = await response.json();
                setStation(data);
                
                // Fetch bills for this station
                const billsResponse = await fetch(`http://localhost:5000/api/filling-stations/${fs_id}/bills`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (billsResponse.ok) {
                    const billsData = await billsResponse.json();
                    const billsArray = billsData.bills || [];
                    const parsedBills = billsArray.map(bill => ({
                        ...bill,
                        quantity: Number(bill.quantity),
                        rate: Number(bill.rate),
                        amount: Number(bill.amount)
                    }));
                    setBills(parsedBills);
                    
                    setAdvanceAmount(billsData.advanceAmount || 0);
                    calculateRemainingBalance(billsData.advanceAmount || 0, billsArray);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to load station data');
            }
        };
        
        fetchOfficers(); // Fetch officers first
        fetchStation();
    }, [fs_id]);

    const calculateRemainingBalance = (advance, bills) => {
        const totalBills = bills.reduce((sum, bill) => sum + (bill.amount || 0), 0);
        const remaining = advance - totalBills;
        setRemainingBalance(remaining);
    };

    const handleAddAdvance = async (e) => {
        e.preventDefault();
        
        if (!newAdvance || isNaN(newAdvance) || parseFloat(newAdvance) <= 0) {
            alert('Please enter a valid advance amount');
            return;
        }

        try {
            const amount = parseFloat(newAdvance);
            const response = await fetch(`http://localhost:5000/api/filling-stations/${fs_id}/advance`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ amount })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add advance');
            }
            
            const data = await response.json();
            setAdvanceAmount(data.amount);
            setRemainingBalance(data.amount - bills.reduce((sum, bill) => sum + bill.amount, 0));
            setNewAdvance('');
        } catch (error) {
            console.error('Error:', error);
            alert(error.message || 'Failed to add advance');
        }
    };

    const handleAddBill = async (e) => {
        e.preventDefault();
        
        // Frontend validation
        if (!newBill.officer || !newBill.fuelType || 
            isNaN(newBill.quantity) || newBill.quantity <= 0 || 
            isNaN(newBill.rate) || newBill.rate <= 0) {
            alert('Please fill all fields with valid values');
            return;
        }

        try {
            const selectedOfficer = officers.find(o => o.id === newBill.officer);
            
            const billData = {
                date: newBill.date,
                officer: selectedOfficer.officer_name, // Send officer name to backend
                officerId: newBill.officer, // Also send officer ID
                fuelType: newBill.fuelType,
                quantity: Number(newBill.quantity),
                rate: Number(newBill.rate),
                amount: Number(newBill.quantity) * Number(newBill.rate)
            };
            
            const response = await fetch(`http://localhost:5000/api/filling-stations/${fs_id}/bills`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(billData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add bill');
            }
            
            const data = await response.json();
            const updatedBills = [data.bill, ...bills];
            setBills(updatedBills);
            setRemainingBalance(advanceAmount - (updatedBills.reduce((sum, bill) => sum + bill.amount, 0)));
            
            setNewBill({
                date: new Date().toISOString().split('T')[0],
                officer: '',
                officerName: '',
                fuelType: 'petrol',
                quantity: '',
                rate: '',
                amount: ''
            });
        } catch (error) {
            console.error('Error:', error);
            alert(error.message || 'Failed to add bill');
        }
    };

    const handleOfficerChange = (e) => {
        const selectedOfficerId = e.target.value;
        const selectedOfficer = officers.find(o => o.id === selectedOfficerId);
        
        setNewBill({
            ...newBill,
            officer: selectedOfficerId,
            officerName: selectedOfficer ? selectedOfficer.officer_name : ''
        });
    };

    if (!station) return <div>Loading...</div>;

    return (
        <div className="p-8">
            <button 
                onClick={() => navigate(-1)}
                className="flex items-center mb-6 text-green-600 hover:text-green-800">
                <ChevronLeft className="mr-1" /> Back to Stations
            </button>
            
            {/* Station Details with Advance Section */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h1 className="text-2xl font-bold mb-2">{station.station_name}</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-600"><span className="font-semibold">Station ID:</span> {station.fs_id}</p>
                            </div>
                            <div>
                                <p className="text-gray-600"><span className="font-semibold">Address:</span> {station.address}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="mb-2">
                            <p className="font-semibold">Advance Balance:</p>
                            <p className={`text-xl ${remainingBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                Rs. {remainingBalance.toFixed(2)}
                            </p>
                        </div>
                        <form onSubmit={handleAddAdvance} className="flex items-end gap-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Add Advance</label>
                                <input
                                    type="number"
                                    value={newAdvance}
                                    onChange={(e) => setNewAdvance(e.target.value)}
                                    className="w-full p-2 border rounded"
                                    min="0"
                                    step="0.01"
                                    placeholder="Amount"
                                    required />
                            </div>
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 h-10">
                                Add
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            
            {/* Billing Form */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4">New Fuel Transaction</h2>
                <form onSubmit={handleAddBill}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <input
                                type="date"
                                value={newBill.date}
                                onChange={(e) => setNewBill({...newBill, date: e.target.value})}
                                className="w-full p-2 border rounded"
                                required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Officer</label>
                            <select
                                value={newBill.officer}
                                onChange={handleOfficerChange}
                                className="w-full p-2 border rounded"
                                required>
                                <option value="">Select an officer</option>
                                {officers.map(officer => (
                                    <option key={officer.id} value={officer.id}>
                                        {officer.officer_name} ({officer.designation})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                            <select
                                value={newBill.fuelType}
                                onChange={(e) => setNewBill({...newBill, fuelType: e.target.value})}
                                className="w-full p-2 border rounded"
                                required>
                                <option value="">Select fuel type</option>
                                <option value="petrol">Petrol</option>
                                <option value="diesel">Diesel</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (Liters)</label>
                            <input
                                type="number"
                                value={newBill.quantity}
                                onChange={(e) => setNewBill({
                                    ...newBill, 
                                    quantity: e.target.value === '' ? '' : parseFloat(e.target.value)
                                })}
                                className="w-full p-2 border rounded"
                                min="0"
                                step="0.01"
                                required/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rate per Liter</label>
                            <input
                                type="number"
                                value={newBill.rate}
                                onChange={(e) => setNewBill({
                                    ...newBill, 
                                    rate: e.target.value === '' ? '' : parseFloat(e.target.value),
                                    amount: e.target.value === '' ? '' : (parseFloat(e.target.value) * newBill.quantity) 
                                })}
                                className="w-full p-2 border rounded"
                                min="0"
                                step="0.01"
                                required/>
                        </div>
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                        <input
                            type="number"
                            value={newBill.quantity * newBill.rate}
                            readOnly
                            className="w-full p-2 border rounded bg-gray-100" />
                    </div>
                    
                    <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                        Add Transaction
                    </button>
                </form>
            </div>
            
            {/* Bills List */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
                {bills.length > 0 ? (
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2 border text-left">Date</th>
                                <th className="p-2 border text-left">Officer</th>
                                <th className="p-2 border text-left">Fuel Type</th>
                                <th className="p-2 border text-left">Quantity</th>
                                <th className="p-2 border text-left">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bills.map((bill) => (
                                <tr key={bill.bill_id} className="hover:bg-gray-50">
                                    <td className="p-2 border">{new Date(bill.date).toLocaleDateString()}</td>
                                    <td className="p-2 border">{bill.officer}</td>
                                    <td className="p-2 border">{bill.fuelType}</td>
                                    <td className="p-2 border">{bill.quantity} L</td>
                                    <td className="p-2 border">Rs. {bill.amount !== null && bill.amount !== undefined ? bill.amount.toFixed(2) : 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-gray-500">No transactions yet</p>
                )}
            </div>
        </div>
    );
}