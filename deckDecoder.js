const snCurrentVersion = 2
let deckCode = 'ADCFRgvuQJBiw0JOF243QFKawFaBpmBIgEBoQJIRI9oAaUB' // is a green/blue deck
let deckByteArray = []

deckCode = deckCode.replace('-', '/').replace('_', '=').slice(3)

buffer.from(deckCode, 'base64').map((e) => deckByteArray.push(e))

let version = deckByteArray[0] >> 4

console.log(deckByteArray.toString())
console.log(version)

let checksum = deckByteArray[1]

console.log('checksum', checksum)

let calcCheckSum = (deckByteArray.reduce((a, c) => a + c) - deckByteArray[0] - deckByteArray[1]) & 0xFF

console.log('calCheckSum', calcCheckSum)

console.log('deck output', ParseDeckInternal(deckCode, deckByteArray))

// reads out a var-int encoded block of bits, returns true if another chunk should follow
function ReadBitsChunk (chunk, NumBits, currShift, OutBits) {
  const continueBit = (1 << NumBits)
  const NewBits = chunk & (continueBit - 1)
  OutBits |= (NewBits << currShift)

  return { didPass: (chunk & continueBit) !== 0, outVal: OutBits }
}

function ReadVarEncodedUint32 (baseValue, baseBits, data, indexStart, indexEnd, outValue) {
  outValue = 0
  let DeltaShift = 0
  let chunk = ReadBitsChunk(baseValue, baseBits, DeltaShift, outValue)
  outValue = chunk.outVal

  if ((baseBits === 0) || chunk.didPass) {
    DeltaShift += baseBits

    while (1) {
      // do we have more room?
      if (indexStart > indexEnd) {
        throw new Error('Error Parsing Deck')
      }
      // read the bits from this next byte and see if we are done
      let NextByte = data[indexStart++]
      chunk = ReadBitsChunk(NextByte, 7, DeltaShift, outValue)

      if (!chunk.didPass) {
        break
      }

      outValue = chunk.outVal

      DeltaShift += 7
    }
  }

  return { didPass: true, chunk, index: indexStart }
}

// handles decoding a card that was serialized
function ReadSerializedCard (data, indexStart, indexEnd, prevCardBase, outCount, outCardID) {
  // end of the memory block?
  if (indexStart > indexEnd) {
    return { didIncrement: false, didPass: false }
  }

  // header contains the count (2 bits), a continue flag, and 5 bits of offset data. If we have 11 for the count bits we have the count
  // encoded after the offset
  let Header = data[indexStart++]
  let newIndex = indexStart
  let bHasExtendedCount = ((Header >> 6) === 0x03)

  // read in the delta, which has 5 bits in the header, then additional bytes while the value is set
  let cardDelta = 0
  const varEnc1 = ReadVarEncodedUint32(Header, 5, data, newIndex, indexEnd, cardDelta)
  newIndex = varEnc1.index
  if (!varEnc1) {
    return { didIncrement: true, didPass: false, index: newIndex }
  } else {
    cardDelta = varEnc1.chunk.outVal
  }

  outCardID = prevCardBase + cardDelta

  // now parse the count if we have an extended count
  if (bHasExtendedCount) {
    const varEnc2 = ReadVarEncodedUint32(0, 0, data, newIndex, indexEnd, outCount)
    newIndex = varEnc2.index
    if (!varEnc2) {
      return { didIncrement: true, didPass: false, index: newIndex }
    } else {
      outCount = varEnc2.chunk.outVal
    }
  } else {
    // the count is just the upper two bits + 1 (since we don't encode zero)
    outCount = (Header >> 6) + 1
  }

  // update our previous card before we do the remap, since it was encoded without the remap
  prevCardBase = outCardID
  const output = {
    outCard: outCardID,
    outCount: outCount,
    prevCard: prevCardBase
  }

  return { didPass: true, didIncrement: true, output, index: newIndex }
}

function ParseDeckInternal (strDeckCode, deckBytes) {
  let currentByteIndex = 0 // Switched to 0 index
  let totalBytes = deckBytes.length

  // check version num
  // currentByteIndex = currentByteIndex++;
  let VersionAndHeroes = deckBytes[currentByteIndex++]
  let version = VersionAndHeroes >> 4
  if (snCurrentVersion !== version && version !== 1) {
    throw new Error('Error Parsing Deck')
  }
  // do checksum check
  // currentByteIndex = currentByteIndex++;
  let checksum = deckBytes[currentByteIndex++]

  let StringLength = 0
  if (version > 1) {
    // currentByteIndex = currentByteIndex++;
    StringLength = deckBytes[currentByteIndex++]
  }
  let totalCardBytes = totalBytes - StringLength

  // grab the string size
  let computedChecksum = 0
  for (let i = currentByteIndex; i < totalCardBytes; i++) {
    computedChecksum += deckBytes[i]
  }

  let masked = (computedChecksum & 0xFF)
  if (checksum !== masked) {
    throw new Error('Error Parsing Deck')
  }

  // read in our hero count (part of the bits are in the version, but we can overflow bits here
  let NumHeroes = 0 // todo setup to track changes
  const heroNumRead32 = ReadVarEncodedUint32(VersionAndHeroes, 3, deckBytes, currentByteIndex, totalCardBytes, NumHeroes)
  if (!heroNumRead32) {
    throw new Error('Error Parsing Deck')
  } else {
    NumHeroes = heroNumRead32.chunk.outVal
    currentByteIndex = heroNumRead32.index
  }

  // ow read in the heroes
  let heroes = []
  let PrevCardBase = 0 // tOD setup to track changes
  for (let currHero = 0; currHero < NumHeroes; currHero++) {
    let HeroTurn = 0
    let HeroCardID = 0
    const readSerializedOne = ReadSerializedCard(deckBytes, currentByteIndex, totalCardBytes, PrevCardBase, HeroTurn, HeroCardID)
    if (!readSerializedOne.didPass) {
      break
    } else if (readSerializedOne.didIncrement) {
      currentByteIndex = readSerializedOne.index
      HeroCardID = readSerializedOne.output.outCard
      HeroTurn = readSerializedOne.output.outCount
      PrevCardBase = readSerializedOne.output.prevCard
    }

    heroes.push({ 'id': HeroCardID, 'turn': HeroTurn })
  }

  let cards = []
  PrevCardBase = 0
  while (currentByteIndex < totalCardBytes) {
    let cardCount = 0
    let cardID = 0
    const readSerializedTwo = ReadSerializedCard(deckBytes, currentByteIndex, totalBytes, PrevCardBase, cardCount, cardID)
    if (!readSerializedTwo.didPass) {
      break
    } else if (readSerializedTwo.didIncrement) {
      currentByteIndex = readSerializedTwo.index
      cardCount = readSerializedTwo.output.outCount
      cardID = readSerializedTwo.output.outCard
      PrevCardBase = readSerializedTwo.output.prevCard
      cards.push({ 'id': cardID, 'count': cardCount })
    }
  }

  let name = ''
  if (currentByteIndex <= totalBytes) {
    const bytes = deckBytes.slice(-1 * StringLength)
    let nameArray = bytes.map((byte) => {
      return String.fromCharCode(byte)
    })
    name = nameArray.join('')
    // replace strip_tags with an HTML sanitizer or escaper as eeded.
    // name = strip_tags(name);  tODO maybe ad this in?
  }
  return { 'heroes': heroes, 'cards': cards, 'name': name }
}
