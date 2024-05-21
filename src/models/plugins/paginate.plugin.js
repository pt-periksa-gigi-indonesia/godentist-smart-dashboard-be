/* eslint-disable no-param-reassign */

const paginate = (schema) => {
  /**
   * @typedef {Object} QueryResult
   * @property {Document[]} results - Results found
   * @property {number} page - Current page
   * @property {number} limit - Maximum number of results per page
   * @property {number} totalPages - Total number of pages
   * @property {number} totalResults - Total number of documents
   */
  /**
   * Query for documents with pagination and aggregation pipeline
   * @param {Array} aggregationPipeline - Aggregation pipeline stages
   * @param {Object} filter - Mongo filter
   * @param {Object} [options] - Query options
   * @param {string} [options.sortBy] - Sorting criteria using the format: sortField:(desc|asc). Multiple sorting criteria should be separated by commas (,)
   * @param {string} [options.populate] - Populate data fields. Hierarchy of fields should be separated by (.). Multiple populating criteria should be separated by commas (,)
   * @param {number} [options.limit] - Maximum number of results per page (default = 10)
   * @param {number} [options.page] - Current page (default = 1)
   * @returns {Promise<QueryResult>}
   */
  schema.statics.paginate = async function (aggregationPipeline, filter, options) {
    let sort = {};
    if (options.sortBy) {
      options.sortBy.split(',').forEach((sortOption) => {
        const [key, order] = sortOption.split(':');
        sort[key] = order === 'desc' ? -1 : 1;
      });
    } else {
      sort = { createdAt: 1 };
    }

    const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;
    const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
    const skip = (page - 1) * limit;

    // Apply the filter to the aggregation pipeline
    if (filter && Object.keys(filter).length > 0) {
      aggregationPipeline.push({ $match: filter });
    }

    // Add sorting to the aggregation pipeline
    aggregationPipeline.push({ $sort: sort });

    // Add the facet stage to calculate total count and get paginated results
    aggregationPipeline.push({
      $facet: {
        totalData: [{ $count: 'count' }],
        data: [{ $skip: skip }, { $limit: limit }],
      },
    });

    // Execute the aggregation pipeline
    const aggregationResult = await this.aggregate(aggregationPipeline).exec();

    // Extract the total count and results
    const totalResults = aggregationResult[0].totalData.length > 0 ? aggregationResult[0].totalData[0].count : 0;
    const results = aggregationResult[0].data;

    const totalPages = Math.ceil(totalResults / limit);

    const result = {
      results,
      page,
      limit,
      totalPages,
      totalResults,
    };
    return result;
  };
};

module.exports = paginate;
