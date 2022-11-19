import { HomeView } from './Home.view'
import { useDispatch, useSelector } from 'react-redux'
import { State } from 'reducers'
import { connect } from 'app/App.components/Menu/Menu.actions'
import { Navigate } from 'react-router'

export const Home = () => {
  const dispatch = useDispatch()
  const loading = useSelector((state: State) => state.loading)
  const { provider, signer, address, contractWithSigner } = useSelector((state: State) => state.wallet)

  const handleConnect = () => {
    dispatch(connect({ forcePermission: false }))
  }

  return <>{address ? <Navigate to="/mint" replace /> : <HomeView handleConnect={handleConnect} />}</>
}
