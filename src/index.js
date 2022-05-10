import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import Web3 from "web3";
import { Web3ReactProvider } from "@web3-react/core";
import { MetaMaskProvider } from "./assets/metamask";
import { SnackbarProvider, useSnackbar } from 'notistack';
// import "bootstrap/dist/css/bootstrap.css";
// import "font-awesome/css/font-awesome.css";
// import 'bootstrap/dist/css/bootstrap.min.css';

function getLibrary(provider, connector) {
  return new Web3(provider);
}

ReactDOM.render(
  <React.StrictMode>
    <SnackbarProvider>
      <Web3ReactProvider getLibrary={getLibrary}>
        <MetaMaskProvider>
          <App />
        </MetaMaskProvider>
      </Web3ReactProvider>
    </SnackbarProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
