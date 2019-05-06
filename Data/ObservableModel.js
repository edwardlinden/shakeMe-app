class ObservableModel {
  constructor() {
    this._observers = [];
  }

  addObserver(observer) {
    this._observers.push(observer);
  }

  notifyObservers() {
    this._observers.forEach(observer => {
      observer.update(this);
    });
  }

  removeObserver(observer) {
    this._observers = this._observers.filter(o => o !== observer);
  }
}

export default ObservableModel;