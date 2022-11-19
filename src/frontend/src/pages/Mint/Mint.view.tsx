import { Input } from 'app/App.components/Input/Input.view'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import getSlug from 'speakingurl'

// prettier-ignore
import { MintBgLeft, MintBgRight, MintGrid, MintStyled } from './Mint.style'

type MintViewProps = {
  mintCallback: (city: string) => void
  connectCallback: () => void
  loading: boolean
  address?: string
}

export const MintView = ({ mintCallback, connectCallback, loading, address }: MintViewProps) => {
  const [city, setCity] = useState('')

  return (
    <MintGrid>
      <MintBgLeft />
      <MintStyled>
        <Link to="/">
          <img alt="logo" src="/logo.svg" />
        </Link>
        <div>Enter the name of your city and mint a new Breathe NFT that will be sent to your wallet for free.</div>

        <label htmlFor="nameCity">Your city</label>
        <Input
          name="nameCity"
          placeholder=""
          type="text"
          onChange={(e: any) => setCity(e.target.value)}
          value={city}
          onBlur={() => {}}
          inputStatus={undefined}
          errorMessage={undefined}
        />

        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            {address ? (
              <img onClick={() => mintCallback(getSlug(city))} alt="button-mint" src="/button-mint.svg" />
            ) : (
              <img onClick={() => connectCallback()} alt="button-connect" src="/button-connect.svg" />
            )}
          </>
        )}
      </MintStyled>
      <MintBgRight />
    </MintGrid>
  )
}
