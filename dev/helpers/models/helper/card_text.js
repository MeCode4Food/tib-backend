exports.replaceHTMLwithMD = (text) => {
  //  replace opening and closing tags with markdown bold tags
  text = text.replace(/<span style='font-weight:bold.+?;'>/g, '**')
    .replace(/<\/span>/g, '**')
    .replace(/<[bB][rR]\/*>/g, '') // all flavours of br

  return text
}
