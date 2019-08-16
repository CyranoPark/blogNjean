export default function arraySortByDate(arr, key, sortMethod) {
  return arr.sort((a, b) => {
    if (new Date(a[key])) {
      if (sortMethod === 'dsc') {
        return new Date(b[key]) - new Date(a[key]);
      }
      return new Date(a[key]) - new Date(b[key]);
    }
  });
}
