function numberWords(limit = 100) {
  const ones = [
    "", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
    "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen",
    "sixteen", "seventeen", "eighteen", "nineteen"
  ];
  const tens = [
    "", "", "twenty", "thirty", "forty", "fifty",
    "sixty", "seventy", "eighty", "ninety"
  ];

  const words = [];

  for (let n = 1; n <= limit; n++) {
    if (n < 20) {
      words.push(ones[n]);
    } else if (n < 100) {
      const ten = Math.floor(n / 10);
      const one = n % 10;
      if (one === 0) {
        words.push(tens[ten]);
      } else {
        words.push(`${tens[ten]}-${ones[one]}`);
      }
    } else if (n === 100) {
      words.push("one hundred");
    }
  }

  return words;
}

export default numberWords(100);
// console.log(numbers);
