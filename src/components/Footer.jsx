import React from 'react'

const Footer = () => {
  const year = new Date().getFullYear();

  return <footer>{`Copyright © AcademiChain Vault ${year}`}</footer>;
};

export default Footer;
