import React, { useState, useEffect } from 'react';
import '../styles/Navbar.css';
import PersonIcon from '@mui/icons-material/Person';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import HomeIcon from '@mui/icons-material/Home';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import logo from '../images/Otaku.jpg';
import small_logo1 from '../images/naruto.png';
import small_logo2 from '../images/deku.png';
import { Link } from 'react-router-dom';
import { ethers } from 'ethers';
import { useLocation } from 'react-router';



/*
This is a React functional component that renders a navigation bar for an application.
It uses the useState and useEffect hooks from the react library to handle state and side effects. 
The component also imports and uses Material UI icons, as well as the Link component from the react-router-dom library to handle client-side routing. 
The component also uses the ethers library to connect to the user's Ethereum wallet.
The component's Connect function prompts the user to connect their Ethereum wallet, 
and the component's useEffect hook listens for changes to the user's Ethereum accounts and updates the component's state and the browser's location accordingly.

*/

const Navbar = () => {

  const [connect, setConnect] = useState(false)

  const location = useLocation()


  // Connect Wallet functionality-------------------------------------------

  const Connect = async () => {

    const chainId = await window.ethereum.request({ method: 'eth_chainId' })

    if(chainId != '0x5') {

      await window.ethereum.request({   // This gives alert Incorrect network!, switch into Goerli
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x5' }],
      })

    }

    await window.ethereum.request({ method: 'eth_requestAccounts' })

    setConnect(true)

      .then(() => {
        
        window.location.replace(location.pathname)

      })

    

  }

  useEffect(() => {

    window.ethereum.on('accountsChanged', (accounts) => {
      
      window.location.replace(location.pathname)

    })

  }, [])

  

  return (
    <div className='navbar'>
      <div className="nav--first">
        <img src={logo} className='nav-logo' />
        <img src={small_logo1} className='small-logos' />
        <strong className='nav-head'>MaryMart <br/>...an anime nft marketplace</strong>
        <img src={small_logo2} className='small-logos' />
      </div>
      <div className="nav--pages">
        <Link to='/'>
          <label className='nav-items' htmlFor="Home">
            <HomeIcon fontSize='large' />
            Home
          </label>
        </Link>
        <Link to='/create'>
          <label className='nav-items' htmlFor="Add Nfts">
            <AddCircleOutlineIcon fontSize='large' />
            Mint NFTs
          </label>
        </Link>
        <Link to='/profile'>
          <label className='nav-items' htmlFor="profile">
            <PersonIcon fontSize='large' />
            Profile
          </label>
        </Link>
        <div>
          <label onClick={Connect} className='nav-items' htmlFor="connect wallet">
            <AccountBalanceWalletIcon fontSize='large' color={connect ? 'success' : ''} />
            {connect ? <strong className='col-green'>Connected</strong> : <strong>Connect Wallet</strong>}
          </label>
        </div>
      </div>
    </div>
  )
}

export default Navbar
