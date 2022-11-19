import { HomeStyled } from './Home.style'

type HomeViewProps = {
  handleConnect: () => void
}

export const HomeView = ({ handleConnect }: HomeViewProps) => {
  return <HomeStyled onClick={handleConnect} />
}
