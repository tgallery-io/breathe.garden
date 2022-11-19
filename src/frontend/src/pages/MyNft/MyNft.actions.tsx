import { showToaster } from 'app/App.components/Toaster/Toaster.actions'
import { ERROR, SUCCESS } from 'app/App.components/Toaster/Toaster.constants'
import axios from 'axios'
import { State } from 'reducers'

export const FETCH_NFTS_REQUEST = 'FETCH_NFTS_REQUEST'
export const FETCH_NFTS_RESULT = 'FETCH_NFTS_RESULT'
export const FETCH_NFTS_ERROR = 'FETCH_NFTS_ERROR'
export const fetchNfts = () => async (dispatch: any, getState: any) => {
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
      type: FETCH_NFTS_REQUEST,
    })

    const tokens = []
    for (let i = 1; i <= 6; i++) {
      const tokenId = await state.wallet.contractWithSigner?.tokenOfOwnerByIndex(state.wallet.address, i)
      const city = await state.wallet.contractWithSigner?._tokenToCity(tokenId)
      console.log(tokenId, city)

      if (city) {
        const pollutionReq = await axios.get(`https://api.waqi.info/feed/${city}/?token=3ab5a02399daca6b7295bbb2579b8d199e480792`)
        console.log(pollutionReq.data)

        const pollution = pollutionReq.data?.data?.aqi
        let level = 1
        if (pollution >= 0 && pollution < 50) level = 1
        if (pollution >= 50 && pollution < 100) level = 2
        if (pollution >= 100) level = 3

        tokens.push({
          tokenId,
          city,
          pollution,
          level,
        })
      }
    }

    console.log(tokens)

    dispatch(showToaster(SUCCESS, 'NFTs fetched from wallet', 'How pretty!'))

    dispatch({
      type: FETCH_NFTS_RESULT,
      tokens,
    })
  } catch (error: any) {
    console.error(error)
    dispatch(showToaster(ERROR, 'Error', error.message))
    dispatch({
      type: FETCH_NFTS_ERROR,
      error,
    })
  }
}
