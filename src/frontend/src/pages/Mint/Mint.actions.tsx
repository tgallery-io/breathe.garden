import { showToaster } from 'app/App.components/Toaster/Toaster.actions'
import { ERROR, SUCCESS } from 'app/App.components/Toaster/Toaster.constants'
import { State } from 'reducers'

export const MINT_REQUEST = 'MINT_REQUEST'
export const MINT_RESULT = 'MINT_RESULT'
export const MINT_ERROR = 'MINT_ERROR'
export const mint = (city: string) => async (dispatch: any, getState: any) => {
  const state: State = getState()

  if (!state.wallet.address) {
    dispatch(showToaster(ERROR, 'Please connect your wallet', 'Please return to homepage'))
    return
  }

  if (state.loading) {
    dispatch(showToaster(ERROR, 'Cannot send transaction', 'Previous transaction still pending...'))
    return
  }

  try {
    dispatch({
      type: MINT_REQUEST,
    })

    const tx = await state.wallet.contractWithSigner?.mint(city)
    const receipt = await tx.wait()
    console.log(receipt)

    dispatch(showToaster(SUCCESS, 'NFT sent to your wallet', 'Enjoy!'))

    dispatch({
      type: MINT_RESULT,
      mintConfirmation: true,
    })
  } catch (error: any) {
    console.error(error)
    dispatch(showToaster(ERROR, 'Error', error.message))
    dispatch({
      type: MINT_ERROR,
      error,
    })
  }
}
