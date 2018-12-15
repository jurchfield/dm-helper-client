const baseUrl = 'https://us-central1-dm-helper-1f262.cloudfunctions.net';

export class Fetcher {
  /** ---- MAIN FETCHER FUNCTION - RUNS ALL API REQUESTS */

  /**
   * @name fetch
   * @param method - method of fetch to be preformed
   * @param uri - uri of fetch method
   * @param body - optional - request body
   * @desc uses fetch() to preform selected action
   */
  static fetch(
    method,
    uri,
    body,
  ) {
    const requestInit = {
      method,
      headers: {
        Token: this._token,
        User: this._user,
      },
      body: JSON.stringify(body),
    };

    return fetch(`${baseUrl}${uri}`, requestInit)
      .then(res => res.json())
      .then(data => data.data || data);
  }

  /** ---- CONSTRUCTOR ---- */

  /**
   * @name constructor
   * @param entityName - name of entity
   * @desc constructs instance of Q
   */
  constructor(entityName) {
    this._entityName = entityName;

    if (!firebase.auth().currentUser) return;

    this._token = localStorage.getItem('token');
    this._user = firebase.auth().currentUser.email;
  }

  /** ---- CRUD FUNCTIONS ---- */

  /**
   * @name get
   * @param id - id of entity
   * @desc endpoint for getting entity by ID
   */
  get(id) {
    const params = ['GET', `/${this._entityName}/${id}`];

    return Fetcher.fetch.apply(this, params);
  }

  /**
   * @name post
   * @param data - request body
   * @desc runs a POST request on selected entity
   */
  post(data) {
    const params = ['POST', `/${this._entityName}`, data];

    return Fetcher.fetch.apply(this, params);
  }

  /**
   * @name put
   * @param data - request body
   * @desc runs a PUT request on selected entity
   */
  put(data) {
    const params = ['PUT', `/${this._entityName}`, data];

    return Fetcher.fetch.apply(this, params);
  }

  /**
   * @name getAll
   * @desc endpoint for getting all of an entity
   */
  getAll() {
    const params = ['GET', `/${this._entityName}`];

    return Fetcher.fetch.apply(this, params);
  }
}
