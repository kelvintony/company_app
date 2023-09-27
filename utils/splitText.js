const splitText = (text) => {
  //   const inputText = 'BURNLEY VS MANCHESTER CITY';
  const inputText = text;
  const delimiter = 'VS';
  const inputTextLower = inputText.toUpperCase();
  const delimiterUpper = delimiter.toUpperCase();
  const parts = inputTextLower.split(delimiterUpper);

  if (parts.length === 2) {
    const textBeforeVS = parts[0]?.trim();
    const textAfterVS = parts[1]?.trim();

    // console.log('Text before VS:', textBeforeVS);
    // console.log('Text after VS:', textAfterVS);
    return {
      textBeforeVS,
      textAfterVS,
    };
  } else {
    return null;
  }
};

export default splitText;
