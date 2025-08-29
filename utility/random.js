import crypto from "crypto";

const consonants = "bcdfghjklmnpqrstvwxyz";
const vowels = "aeiou";

function randomWord(length = 4) {
  let word = "";
  for (let i = 0; i < length; i++) {
    if (i % 2 === 0) {
      word += consonants[crypto.randomInt(0, consonants.length)];
    } else {
      word += vowels[crypto.randomInt(0, vowels.length)];
    }
  }
  return word;
}

export default function randomThreeWords() {
  return [randomWord(), randomWord(), randomWord()].join("-");
}

export function randomKey(length = 32, encoding = "hex") {
  return crypto.randomBytes(length).toString(encoding);
}
