interface Observer {
  next(value?: any): void;
  error(value: any): void;
  complete(): void;
}

class Observable {
  _subscribe: (
    observer: Observer
  ) => {
    unsubscribe(): void;
  };

  constructor(
    subscribe: (
      observer: Observer
    ) => {
      unsubscribe(): void;
    }
  ) {
    this._subscribe = subscribe;
  }

  subscribe(observer: Observer) {
    return this._subscribe(observer);
  }

  static hotTimeout(time) {
    let obs: Observer = null;
    const cancelId = setTimeout(() => {
      if (!obs) return;

      obs.next();
      obs.complete();
    }, time);

    return new Observable((observer) => {
      obs = observer;

      return {
        unsubscribe() {
          clearTimeout(cancelId);
        },
      };
    });
  }

  static timeout(time) {
    return new Observable((observer) => {
      const cancelId = setTimeout(() => {
        observer.next();
        observer.complete();
      }, time);

      return {
        unsubscribe() {
          clearTimeout(cancelId);
        },
      };
    });
  }

  static fromEvent<K extends keyof HTMLElementEventMap>(
    dom: HTMLElement,
    eventName: K
  ) {
    return new Observable((observer) => {
      const handler = (e: HTMLElementEventMap[K]) => {
        observer.next(e);
      };

      dom.addEventListener(eventName, handler);

      return {
        unsubscribe() {
          dom.removeEventListener(eventName, handler);
        },
      };
    });
  }

  static allNumbers() {
    let num = 0;
    return new Observable((observer) => {
      observer.next(num++);
      return {
        unsubscribe() {
          num = 0;
        },
      };
    });
  }

  map(projection: (v: any) => any) {
    return new Observable((observer) => {
      const subscription = this.subscribe({
        next(v) {
          try {
            const value = projection(v);
            observer.next(value);
          } catch (e) {
            observer.error(e);
            subscription.unsubscribe();
          }
        },
        complete() {
          observer.complete();
        },
        error(e) {
          observer.error(e);
        },
      });

      return subscription;
    });
  }
}

const obs = Observable.allNumbers();

obs.subscribe({
  next(v) {
    console.log(v);
  },
  complete() {
    console.log("complete");
  },
  error() {
    console.log("error");
  },
});

obs.subscribe({
  next(v) {
    console.log(v);
  },
  complete() {
    console.log("complete");
  },
  error() {
    console.log("error");
  },
});

obs.subscribe({
  next(v) {
    console.log(v);
  },
  complete() {
    console.log("complete");
  },
  error() {
    console.log("error");
  },
});
