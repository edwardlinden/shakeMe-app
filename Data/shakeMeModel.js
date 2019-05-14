import ObservableModel from "./ObservableModel";


const BASE_URL = "http://pebble-pickup.herokuapp.com/tweets"; //returns all lines available, add /random to get a random line
const httpOptions = {
  headers: { "API-name": "API-key" }
};

class shakeMeModel extends ObservableModel {
  constructor() {
    super();
    //this.numberOfGuests = parseInt(localStorage.getItem("old-pickup-lines"), 10)|| 4;
  }
  /**
   * Get random pickup line
   * @returns {Promise<any>}
   */
  getRandomPickUpLine() {
    const url = BASE_URL + "/random";
    return fetch(url).then(this.processResponse);
  }

    /**
     * Get all pickup lines available in API
     * @returns {Promise<any>}
     */
  getAllLines() {
    return fetch(BASE_URL).then(this.processResponse);
  }

  getPickupLineById(id) {
    let lines;
    this.getAllLines().then(res => lines = res);

    for(let i; i < lines.length; i++) {
      if(lines[i]._id == id) return lines[i]; //unless id is always a string, do not change to ===. _id in API is a string.
    }
  }

  processResponse(response) {
      if (response.ok) {
          return response.json();
      }
      throw response;
  }


}

// Export an instance of shrekMeModel
const modelInstance = new shakeMeModel();
export default modelInstance;