import ObservableModel from "./ObservableModel";

const BASE_URL = "http://pebble-pickup.herokuapp.com/tweets";
const httpOptions = {
  headers: { "API-name": "API-key" }
};

class shakeMeModel extends ObservableModel {
  constructor() {
    super();
    this.numberOfGuests = parseInt(localStorage.getItem("old-pickup-lines"), 10)|| 4;
  }
  /**
   * Get pick up line by ID
   * @returns {number}
   */
  getPickUpLine() {
    return this.getLine;
  }


}

// Export an instance of shrekMeModel
const modelInstance = new shakeMeModel();
export default modelInstance;