interface Item<T> {
  value: T;
  attempts: number;
}
// Queue that keep only unique values and counts attempts
export class UniqueQueue<T> {
  private queue = new Array<Item<T>>();

  public push(value: T, attempts: number) {
    if (attempts < 1) {
      console.error("Triyng to enqueue item with attempts < 1");
      return;
    }
    this.remove(value);

    this.queue.push({ value, attempts });
  }

  public remove(value: T) {
    this.queue = this.queue.filter((item) => item.value !== value);
  }

  public iterationQueue() {
    const extractIteration = (
      prev: { queue: UniqueQueue<T>; iteration: Array<T> },
      curr: Item<T>
    ) => {
      prev.iteration.push(curr.value);
      if (curr.attempts > 1) {
        prev.queue.push(curr.value, curr.attempts - 1);
      }

      return prev;
    };

    const { queue, iteration } = this.queue.reduce(extractIteration, {
      queue: new UniqueQueue<T>(),
      iteration: [],
    });

    this.queue = queue.queue;
    return iteration;
  }
}
