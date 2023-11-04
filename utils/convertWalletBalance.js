const walletBalance = (accountBalance) => {
  if (accountBalance !== undefined) {
    const roundedBalance = Math.ceil(parseFloat(accountBalance) * 100) / 100; // Round up to two decimal places
    const formattedBalance = roundedBalance.toFixed(2); // Format the rounded balance
    return formattedBalance;
  }
};

export default walletBalance;
