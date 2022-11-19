import { CONNECT } from 'app/App.components/Menu/Menu.actions'
import { ethers } from 'ethers'

export interface WalletState {
  provider?: ethers.providers.Web3Provider
  signer?: ethers.providers.JsonRpcSigner
  address?: string
  contractWithSigner?: ethers.Contract
}

const walletDefaultState: WalletState = {
  provider: undefined,
  signer: undefined,
  address: undefined,
  contractWithSigner: undefined,
}

export function wallet(state = walletDefaultState, action: any): WalletState {
  switch (action.type) {
    case CONNECT:
      return {
        ...state,
        provider: action.provider,
        signer: action.signer,
        address: action.address,
        contractWithSigner: action.contractWithSigner,
      }
    default:
      return state
  }
}
