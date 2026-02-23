const ar = Array.from({ length: 10 }).map((_, index) => index);

const obj = { a: 1, b: 2 };

const saved = ar.reduce((acc, val) => {
  acc[val] = 1;
  return acc;
}, {});

console.log(saved);
console.log(
  ar.reduce((acc, val) => {
    acc[val] = 1;
    return acc;
  }, {})
);

const nr = 1534 * 0.9

console.log(Number(nr.toFixed(2)));
