class MetaReader {
  /**
   * Must return the list of properties to be mapped to an xo-form
   */
  get properties() {}

  /**
   * Called to get one field schema based on one single schema property
   * @param {Object} key 
   */
  getFieldSchema(key) {}
}

export default MetaReader;
