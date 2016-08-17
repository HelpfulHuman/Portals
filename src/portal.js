import { createRequestObject, sendRequest } from './utils';

export default class Portal {

  /**
   * Set up our portal instance.
   */
  constructor () {
    this._requestInterceptors = [];
    this._responseInterceptors = [];
    this._errorHandlers = [];
  }

  /**
   * Add an interceptor for modifying a request before it's sent
   * out via AJAX/XHR.
   *
   * @param  {Function} fn
   * @return {this}
   */
  onRequest (fn) {
    // enforce that the given value is a function
    if (typeof fn !== 'function') {
      throw new Error('You must provide a valid function as an interceptor!');
    }
    // add the interceptor to the list of interceptors
    this._requestInterceptors.push(fn);

    return this;
  }

  /**
   * Add an interceptor for modifying a response before it's given
   * to the user's promise subscriber.
   *
   * @param  {Function} fn
   * @return {this}
   */
  onResponse (fn) {
    // enforce that the given value is a function
    if (typeof fn !== 'function') {
      throw new Error('You must provide a valid function as an interceptor!');
    }
    // add the interceptor to the list of interceptors
    this._responseInterceptors.push(fn);

    return this;
  }

  /**
   * Add an error handler that will be invoked whenever a Portal
   * request errors out.
   *
   * @param  {Function} fn
   * @return {this}
   */
  onError (fn) {
    // enforce that the given value is a function
    if (typeof fn !== 'function') {
      throw new Error('You must provide a valid function as an error handler!');
    }
    // add the handler to the list of handlers
    this._errorHandlers.push(fn);

    return this;
  }

  /**
   * Creates an XHR object and sends it out, returning a promise
   * that can be used to subscribe to resolution or rejection
   * states.
   *
   * @param  {Object} req
   * @return {Promise}
   */
  send (req = {}) {
    // create our XHR object for the request
    var xhr = createRequestObject();
    // send the request and get the promise for the result
    var promise = sendRequest(xhr, req, this._requestInterceptors, this._responseInterceptors, this._errorHandlers);
    // attach the XHR object's abort() method to the promise
    promise.abort = xhr.abort.bind(xhr);
    // return the promise
    return promise;
  }

  /**
   * Helper methods for GET, POST, PUT and DELETE.
   */

  get (url, req = {}) {
    return this.send(Object.assign({}, req, { method: 'GET', url }));
  }

  post (url, body, req = {}) {
    return this.send(Object.assign({}, req, { method: 'POST', url, body }));
  }

  put (url, body, req = {}) {
    return this.send(Object.assign({}, req, { method: 'PUT', url, body }));
  }

  delete (url, req = {}) {
    return this.send(Object.assign({}, req, { method: 'DELETE', url }));
  }

}
