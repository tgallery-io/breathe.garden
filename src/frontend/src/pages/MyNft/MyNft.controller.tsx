import * as React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { State } from 'reducers'

import { fetchNfts } from './MyNft.actions'
import { MyNftView } from './MyNft.view'

export const MyNft = () => {
  const dispatch = useDispatch()
  const { loading, tokens } = useSelector((state: State) => state.contract)

  useEffect(() => {
    dispatch(fetchNfts())
  }, [dispatch])

  return <MyNftView tokens={tokens} loading={loading} />
}
