import { MINT_ERROR, MINT_REQUEST, MINT_RESULT } from 'pages/Mint/Mint.actions'
import { FETCH_NFTS_ERROR, FETCH_NFTS_REQUEST, FETCH_NFTS_RESULT } from 'pages/MyNft/MyNft.actions'

export interface ContractState {
  loading: boolean
  mintConfirmation?: number
  error?: any
  tokens: any[]
}

const contractDefaultState: ContractState = {
  loading: false,
  mintConfirmation: undefined,
  error: undefined,
  tokens: [],
}

export function contract(state = contractDefaultState, action: any): ContractState {
  switch (action.type) {
    case MINT_REQUEST:
      return {
        ...state,
        loading: true,
        mintConfirmation: undefined,
        error: undefined,
      }
    case MINT_RESULT:
      return {
        ...state,
        loading: false,
        mintConfirmation: action.mintConfirmation,
        error: undefined,
      }
    case MINT_ERROR:
      return {
        ...state,
        loading: false,
        mintConfirmation: undefined,
        error: action.error,
      }
    case FETCH_NFTS_REQUEST:
      return {
        ...state,
        loading: true,
        tokens: [],
      }
    case FETCH_NFTS_RESULT:
      return {
        ...state,
        loading: false,
        tokens: action.tokens,
      }
    case FETCH_NFTS_ERROR:
      return {
        ...state,
        loading: false,
        tokens: [],
      }
    default:
      return state
  }
}
