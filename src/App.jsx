import { useState } from 'react'
import './App.css'


const initialTransactions = [
  { id: 1, name: 'Today Lunch',    date: 'Jan 15, 2026', category: 'Food',     type: 'expense', amount: 150 },
  { id: 2, name: 'Shirt Buying',   date: 'Jan 25, 2026', category: 'Clothing', type: 'expense', amount: 1500 },
  { id: 3, name: 'My Salary',      date: 'Jan 26, 2026', category: 'Salary',   type: 'income',  amount: 20000 },
  { id: 4, name: 'Mobile Recharge',date: 'Jan 28, 2026', category: 'Recharge', type: 'expense', amount: 350 },
  { id: 5, name: 'Today Dinner',   date: 'Jan 30, 2026', category: 'Food',     type: 'expense', amount: 450 },
];

function App() {
  const [dark, setDark]               = useState(false);
  const [showModal, setShowModal]     = useState(false);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [editingId,  setEditingId]    = useState(null); 

  // Form state
  const [formName,     setFormName]     = useState('');
  const [formAmount,   setFormAmount]   = useState('');
  const [formCategory, setFormCategory] = useState('Food');
  const [formType,     setFormType]     = useState('expense');
  const [formDate,     setFormDate]     = useState('');
  const [formError,    setFormError]    = useState('');

  document.body.className = dark ? 'dark' : 'light';

  const totalIncome   = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const totalBalance  = totalIncome - totalExpenses;

 
  const fmt = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2 });

  const resetForm = () => {
    setFormName(''); setFormAmount(''); setFormCategory('Food');
    setFormType('expense'); setFormDate(''); setFormError('');
    setEditingId(null);
  };

  const handleAdd = () => {
    if (!formName.trim())    { setFormError('Please enter an expense name.'); return; }
    if (!formAmount || isNaN(formAmount) || Number(formAmount) <= 0) {
      setFormError('Please enter a valid amount.'); return;
    }

    const today = formDate
      ? new Date(formDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    if (editingId !== null) {
   
      setTransactions(prev =>
        prev.map(t =>
          t.id === editingId
            ? { ...t, name: formName.trim(), date: today, category: formCategory, type: formType, amount: parseFloat(formAmount) }
            : t
        )
      );
    } else {
    
      const newEntry = {
        id:       Date.now(),
        name:     formName.trim(),
        date:     today,
        category: formCategory,
        type:     formType,
        amount:   parseFloat(formAmount),
      };
      setTransactions(prev => [newEntry, ...prev]);
    }

    resetForm();
    setShowModal(false);
  };

 
  const handleEdit = (t) => {
    setEditingId(t.id);
    setFormName(t.name);
    setFormAmount(String(t.amount));
    setFormCategory(t.category);
    setFormType(t.type);
    setFormDate(''); 
    setFormError('');
    setShowModal(true);
  };

  const handleDelete = (id) => setTransactions(prev => prev.filter(t => t.id !== id));

  const handleClose = () => {
    resetForm();
    setShowModal(false);
  };

  
  return (
    <div className="app">
    
      <div className="counter">
        <h1>AI Expense Tracker</h1>
        <div className="same">
          <div className="btn">
            <button onClick={() => setShowModal(true)} className="addbtn">+ Add Expense</button>
          </div>
          <div className={dark ? 'dark' : 'light'}>
            <button className="nor" onClick={() => setDark(!dark)}>{dark ? '🌞' : '🌛'}</button>
          </div>
        </div>
      </div>

      <div className="wrap">
     
        <div className="data-boxes">
          <div className="income">
            <p>TOTAL INCOME</p>
            <p className="in">$ {fmt(totalIncome)}</p>
          </div>
          <div className="expense">
            <p>TOTAL EXPENSES</p>
            <p className="ex">$ {fmt(totalExpenses)}</p>
          </div>
          <div className="balance">
            <p>TOTAL BALANCE</p>
            <p className="bl">$ {fmt(totalBalance)}</p>
          </div>
          <div className="transactions">
            <p>TRANSACTIONS</p>
            <p className="tr">{transactions.length}</p>
          </div>
        </div>

        <div className="main-data">
          <div className="over"><p>OVERVIEW</p></div>
          <div className="trans"><p>ALL TRANSACTIONS</p></div>
        </div>
        <br /><br />

      
        <div className="allvalues">
          {transactions.length === 0 && (
            <p style={{ textAlign: 'center', color: '#aaa', padding: '2rem' }}>
              No transactions yet. Click "+ Add Expense" to get started!
            </p>
          )}
          {transactions.map(t => (
            <div key={t.id} className="value">
              <div className="set">
                <p>{t.name}</p>
                <p>{t.date}</p>
                <p>🏷️ {t.category}</p>
              </div>
              <div className="settwo">
                <p className={t.type === 'income' ? 'green' : 'red'}>
                  {t.type === 'income' ? '+' : '-'}${fmt(t.amount)}
                </p>
                <div className="fl">
                  <div className="edit-btn">
                    <button className="et" onClick={() => handleEdit(t)}>✏️</button>
                  </div>
                  <div className="del-btn">
                    <button className="del" onClick={() => handleDelete(t.id)}>🗑️</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

     
      {showModal && (
        <div className="model">
          <div className="model-box">
            <h2>{editingId !== null ? '✏️ Edit Transaction' : 'Add Transaction'}</h2>

            {formError && (
              <p style={{ color: '#e74c3c', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{formError}</p>
            )}

            <input
              type="text"
              placeholder="Expense / Income name"
              value={formName}
              onChange={e => { setFormName(e.target.value); setFormError(''); }}
            />

            <input
              type="number"
              placeholder="Amount (e.g. 500)"
              value={formAmount}
              onChange={e => { setFormAmount(e.target.value); setFormError(''); }}
            />

            <select
              value={formCategory}
              onChange={e => setFormCategory(e.target.value)}
              style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px',
                       border: '1.5px solid #ccc', marginBottom: '0.75rem', fontSize: '0.95rem' }}
            >
              <option>Food</option>
              <option>Clothing</option>
              <option>Salary</option>
              <option>Recharge</option>
              <option>Entertainment</option>
              <option>Transport</option>
              <option>Health</option>
              <option>Shopping</option>
              <option>Other</option>
            </select>

            <select
              value={formType}
              onChange={e => setFormType(e.target.value)}
              style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px',
                       border: '1.5px solid #ccc', marginBottom: '0.75rem', fontSize: '0.95rem' }}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>

            <input
              type="date"
              value={formDate}
              onChange={e => setFormDate(e.target.value)}
              style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px',
                       border: '1.5px solid #ccc', marginBottom: '0.75rem', fontSize: '0.95rem',
                       boxSizing: 'border-box' }}
            />

            <div className="hu">
              <button className="mar" onClick={handleAdd}>{editingId !== null ? 'Update' : 'Add'}</button>
              <button className="sup" onClick={handleClose}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App
