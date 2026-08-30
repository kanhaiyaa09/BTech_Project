import './App.css';
import React, { useEffect } from 'react';
import Homepage from './components/Homepage';
import Footer from './components/Footer';

const REBRAND_MAP = [
  ['Block Certify', 'AcademiChain Vault'],
  ['Generation Portal', 'Credential Studio'],
  ['Choose Design', 'Choose Credential Design'],
  ['NFT Mint 🔗', 'Register Credential 🔗'],
  ['Verify ✅', 'Verify Academic Record ✅'],
  ['1. Rules for Certificate Generation', '1. Rules for Credential Generation'],
  ['2. Rules for NFT Minting', '2. Rules for Credential Registration'],
  ['Download E-Certificate', 'Download Academic Credential'],
  ['Locate and tap on the "NFT Mint" button', 'Open the "Register Credential" section'],
  ['Will be redirected to NFT Section', 'Review and register the credential'],
  ['Heading', 'Credential Title'],
  ['Enter heading', 'Enter credential title'],
  ['Particpant Name', 'Learner Name'],
  ['Enter participant Name', 'Enter learner name'],
  ['Description', 'Credential Description'],
  ['Enter Description', 'Enter credential description'],
  ['Author Name', 'Issuing Authority'],
  ['Enter Author Name', 'Enter issuing authority'],
  ['Logo URL', 'Institution Logo URL'],
  ['Enter logo URL', 'Enter institution logo URL'],
];

function applyAcademiChainBranding(root = document.body) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes = [];

  while (walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }

  textNodes.forEach((node) => {
    let text = node.nodeValue;
    REBRAND_MAP.forEach(([from, to]) => {
      text = text.split(from).join(to);
    });
    if (text !== node.nodeValue) {
      node.nodeValue = text;
    }
  });
}

function App() {
  useEffect(() => {
    document.title = 'AcademiChain Vault - Credential Generation';

    applyAcademiChainBranding();

    const observer = new MutationObserver(() => {
      applyAcademiChainBranding();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div>
      <Homepage />
      <Footer />
    </div>
  );
}

export default App;
