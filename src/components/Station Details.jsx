import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function FillingStationDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [station, setStation] = useState(null);
    const [bills, setBills] = useState([]);
    const [newBill, setNewBill] = useState({
        date: new Date().toISOString().split('T')[0],
        customer: '',
        fuelType: 'petrol',
        quantity: 0,
        rate: 0,
        amount: 0
    });

    useEffect(() => {
        // Fetch station details
        const fetchStation = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/filling-stations/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                
                if (!response.ok) throw new Error('Failed to fetch station');
                
                const data = await response.json();
                setStation(data);
                
                // Fetch bills for this station
                const billsResponse = await fetch(`http://localhost:5000/api/filling-stations/${id}/bills`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                
                if (billsResponse.ok) {
                    const billsData = await billsResponse.json();
                    setBills(billsData);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to load station data');
            }
        };
        
        fetchStation();
    }, [id]);

    const handleAddBill = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch(`http://localhost:5000/api/filling-stations/${id}/bills`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(newBill)
            });
            
            if (!response.ok) throw new Error('Failed to add bill');
            
            const data = await response.json();
            setBills([...bills, data]);
            setNewBill({
                date: new Date().toISOString().split('T')[0],
                customer: '',
                fuelType: 'petrol',
                quantity: 0,
                rate: 0,
                amount: 0
            });
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to add bill');
        }
    };

    if (!station) return <div>Loading...</div>;

    return (
        <div className="p-8">
            <button 
                onClick={() => navigate(-1)}
                className="flex items-center mb-6 text-green-600 hover:text-green-800"
            >
                <ChevronLeft className="mr-1" /> Back to Stations
            </button>
            
            <h1 className="text-2xl font-bold mb-2">{station.station_name}</h1>
            <p className="text-gray-600 mb-8">Station ID: {station.fs_id}</p>
            
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
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                            <input
                                type="text"
                                value={newBill.customer}
                                onChange={(e) => setNewBill({...newBill, customer: e.target.value})}
                                className="w-full p-2 border rounded"
                                placeholder="Customer name"
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                            <select
                                value={newBill.fuelType}
                                onChange={(e) => setNewBill({...newBill, fuelType: e.target.value})}
                                className="w-full p-2 border rounded"
                            >
                                <option value="petrol">Petrol</option>
                                <option value="diesel">Diesel</option>
                                <option value="kerosene">Kerosene</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (Liters)</label>
                            <input
                                type="number"
                                value={newBill.quantity}
                                onChange={(e) => setNewBill({...newBill, quantity: parseFloat(e.target.value)})}
                                className="w-full p-2 border rounded"
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rate per Liter</label>
                            <input
                                type="number"
                                value={newBill.rate}
                                onChange={(e) => setNewBill({...newBill, rate: parseFloat(e.target.value), amount: parseFloat(e.target.value) * newBill.quantity})}
                                className="w-full p-2 border rounded"
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                        <input
                            type="number"
                            value={newBill.quantity * newBill.rate}
                            readOnly
                            className="w-full p-2 border rounded bg-gray-100"
                        />
                    </div>
                    
                    <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
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
                                <th className="p-2 border text-left">Customer</th>
                                <th className="p-2 border text-left">Fuel Type</th>
                                <th className="p-2 border text-left">Quantity</th>
                                <th className="p-2 border text-left">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bills.map((bill) => (
                                <tr key={bill.bill_id} className="hover:bg-gray-50">
                                    <td className="p-2 border">{new Date(bill.date).toLocaleDateString()}</td>
                                    <td className="p-2 border">{bill.customer}</td>
                                    <td className="p-2 border">{bill.fuelType}</td>
                                    <td className="p-2 border">{bill.quantity} L</td>
                                    <td className="p-2 border">Rs. {bill.amount.toFixed(2)}</td>
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