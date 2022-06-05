export const arrayMove = <T>(array: Array<T>, from: number, to: number) => {
  const element = array[from];
  array.splice(from, 1);
  array.splice(to, 0, element);
}

export const shuffleArray = <T>(array: Array<T>) => {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}