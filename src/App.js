import logo from './logo.svg';
import './App.css';
import useMetaMask from './assets/metamask';
import { useState } from 'react';
import { bootstrap } from 'bootstrap/dist/css/bootstrap.css';

function App() {
  const [amount, setAmount] = useState(0);
  const {ConnectWallet, DisconnectWallet, walletAddr, withdraw, connected} = useMetaMask();
  return (
    <div className='row' style={{ margin: 30 }}>
      <div className='col-5'>
        <div className='row' style={{ marginLeft: 30 }} >
          <button className="btn btn-primary" onClick={ connected ? DisconnectWallet : ConnectWallet}>{connected ? "Disconnect" : "Connect"}</button>
        </div>
        <div className='row' style={{marginLeft: 30, marginTop: 20 }}>
          <button className="btn btn-success" onClick={ConnectWallet}>{ connected ? walletAddr : "Connect Wallet"}</button> 
        </div>
        <div className='row' style={{marginLeft: 30, marginTop: 20 }}>
          <button className='btn btn-info' onClick={() => withdraw(amount)}>Withdraw</button>
        </div>
      </div>
      <div className='col-6' style={{ marginLeft: 50 }}>
        <div className='row'>
          {/* <input type="number" style={{ width: 200 }} value={amount} onChange={e => setAmount(e.target.value)} /> */}
          <div class="form-outline">
            <input type="number" id="typeNumber" class="form-control" 
                value={amount} onChange={e => setAmount(e.target.value)} 
            />
            
          </div>
        </div>
      </div>      
    </div>
  );
}

export default App;
