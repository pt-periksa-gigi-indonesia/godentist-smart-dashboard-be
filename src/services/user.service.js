const httpStatus = require('http-status');
const crypto = require('crypto');
const { emailSecret } = require('../config/config');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

function decrypt(text) {
  const keyBuffer = Buffer.from(emailSecret, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, Buffer.alloc(16));
  let decrypted = decipher.update(text, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return User.create(userBody);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const pipeline = [
    {
      $match: {
        role: { $ne: 'master' }, // Exclude documents with role "master"
      },
    },
    {
      $project: {
        _id: 0,
        id: '$_id',
        name: 1,
        email: 1,
        role: 1,
      },
    },
  ];

  // Run the query
  const users = await User.paginate(pipeline, filter, options);

  // Decrypt email for each user
  const decryptedUsers = users.results.map((user) => ({
    ...user,
    email: decrypt(user.email),
  }));

  const rolesCount = await User.aggregate([
    { $match: { role: { $in: ['user', 'admin'] } } },
    { $group: { _id: '$role', count: { $sum: 1 } } },
    {
      $project: {
        role: '$_id',
        count: 1,
        _id: 0,
      },
    },
  ]);

  // Return the formatted result
  return {
    results: decryptedUsers,
    page: users.page,
    limit: users.limit,
    totalPages: users.totalPages,
    totalResults: users.totalResults,
    rolesCount,
  };
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
};
