import React, {  useState } from 'react';
import './App.css';
import {login, logout} from "./utils";
import {config} from "./config";

function App() {
  const [word, set_word] = useState("world");

  // when the user has not yet interacted with the form, disable the button
  const [buttonDisabled, setButtonDisabled] = React.useState(true);

  // after submitting the form, we want to show Notification
  const [showNotification, setShowNotification] = React.useState(false);
  // if not signed in, return early with sign-in prompt
  if (!window.walletConnection.isSignedIn()) {
    return (
      <main>
        <h1>Welcome to Hello Name Dapp!</h1>
        <p>
          To make use of the Dapp. You would need to sign in to the NEAR blockchain. The button
          below will sign you in using NEAR Wallet.
        </p>
        <p>
          By default, when your app runs in "development" mode, it connects
          to a test network ("testnet") wallet. This works just like the main
          network ("mainnet") wallet, but the NEAR Tokens on testnet aren't
          convertible to other currencies – they're just for testing!
        </p>
        <p>
          Go ahead and click the button below to try it out:
        </p>
        <p style={{ textAlign: 'center', marginTop: '2.5em' }}>
          <button onClick={login}>Sign in</button>
        </p>
      </main>
    )
  }
    return (
      <> {/* Reactfragment: used to render multiple elements */}
          <button className="link" style={{ float: 'right' }} onClick={logout}> {/*uses normal css properties*/}
            Sign out
          </button>
          <main>
            <h1>
                <label htmlFor="greeting" style={{ color: 'var(--secondary)', borderBottom: '2px solid var(--secondary)' }}>Hello, {word}!</label>
            </h1>
            <form onSubmit={async event => {  event.preventDefault(); // preventDefault form action
                                            const { fieldset, greeting } = event.target.elements;

                                            // hold onto new user-entered value from React's SynthenticEvent for use after `await` call
                                            const newGreeting = greeting.value
                                            // disable the form while the value gets updated on-chain
                                            fieldset.disabled = true

                                            try {
                                                  // make an update call to the smart contract
                                                  await window.contract.input_name({
                                                  // pass the value that the user entered in the greeting field
                                                  name: newGreeting
                                                  })
                                            } catch (e) {
                                              alert(
                                                'Something went wrong! ' +
                                                'Maybe you need to sign out and back in? ' +
                                                'Check your browser console for more info.'
                                              )
                                              throw e
                                            } finally {
                                              // re-enable the form, whether the call succeeded or failed
                                              fieldset.disabled = false;
                                            }
                                            // update local `greeting` variable to match persisted value
                                            set_word(newGreeting);

                                            // show Notification
                                            setShowNotification(true);

                                            // remove Notification again after css animation completes
                                            // this allows it to be shown again next time the form is submitted
                                            setTimeout(() => {
                                              setShowNotification(false)
                                            }, 22555);
              }}>
              <fieldset id="fieldset">
                <label htmlFor="greeting" style={{ display: 'block', color: 'var(--gray)', marginBottom: '0.5em'}}>Input your name:</label>
                <div style={{ display: 'flex' }}>
                  <input autoComplete="off" onChange={(e) => setButtonDisabled(e.target.value === word)} placeholder={`Hello ${word}!`} id="greeting"  style={{ flex: 1 }}/>
                  <button disabled={buttonDisabled} style={{ borderRadius: '0 5px 5px 0' }}>Save</button>
                </div>
              </fieldset>
            </form>
            <p>Hey! {word} &#128075; This Hello World dapp! saves your name on the Near Blockchain!</p>
          </main>
            {showNotification && <Notification />}
          </>
        );
}

function Notification() {
  const urlPrefix = `https://explorer.${config.networkId}.near.org/accounts`;
  return (
    <aside>
    Hey confirm your Transaction here: &nbsp;
      <a target="_blank" rel="noopener noreferrer" href={`${urlPrefix}/${window.contract.contractId}`}>
        {window.contract.contractId}
      </a>
      <footer>
        <div>✔ Succeeded &#129316;</div>
        <div>Just now</div>
      </footer>
    </aside>
  )
}



export default App;
