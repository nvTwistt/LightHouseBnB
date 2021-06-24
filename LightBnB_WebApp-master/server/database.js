const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});
/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  return pool.query(`
  SELECT *
  FROM users
  WHERE email = $1`,
  [email])
  .then(res => {
     const user = res.rows[0];
     if (user) {
       return user;
     } else {
       return null;
     }
  })
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool.query(`
  SELECT *
  FROM users
  WHERE id = $1`,
  [id])
  .then(res => {
     const user = res.rows[0];
     if (user) {
       return user;
     } else {
       return null;
     }
  })
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  let userData = [user.name, user.password, user.email];
  return pool.query(`
  INSERT INTO users (name, email, password)
  VALUES ($1, $3, $2)
  RETURNING *;
  `, userData)
  .then(res => {
    console.log(res.rows[0])
    return res.rows[0];
  })
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  const userInfo = [guest_id, limit];
  return pool.query(`
  SELECT properties.*, reservations.*, AVG(rating) as average_rating
  FROM properties
  JOIN reservations ON reservations.property_id = properties.id
  JOIN property_reviews ON properties.id = property_reviews.property_id 
  WHERE reservations.guest_id = $1
  AND (reservations.end_date < now()::date
  OR reservations.start_date > now()::date)
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date DESC
  LIMIT $2;`, userInfo)
  .then(res => {
    return res.rows;
  })
  .catch(err => err.message);
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function (options, limit = 10) {
  // 1
  const queryParams = [];
  // 2
  let queryString = `
  SELECT properties.*, AVG(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  // 3
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }
  if (options.owner_id) {
    queryParams.push(options.owner_id);
    if (queryParams.length === 1) {
      queryString += `WHERE owner_id = $${queryParams.length} `;
    } else {
      queryString += `AND owner_id = $${queryParams.length} `;
    }
  }
  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    let minimum_price_dollars = options.minimum_price_per_night * 100;
    let maximum_price_dollars = options.maximum_price_per_night * 100;
    queryParams.push(minimum_price_dollars, maximum_price_dollars);
    if (queryParams.length === 2) {
      queryString += `WHERE cost_per_night >= $${queryParams.length - 1} AND cost_per_night <= $${queryParams.length} `;
    } else {
      queryString += `AND cost_per_night >= $${queryParams.length - 1} AND cost_per_night <= $${queryParams.length} `;
    }
  } else if (options.minimum_price_per_night) {
    let minimum_price_dollars = options.minimum_price_per_night * 100;
    queryParams.push(minimum_price_dollars);
    if (queryParams.length === 1) {
      queryString += `WHERE cost_per_night >= $${queryParams.length}`;
    } else {
      queryString += `AND cost_per_night >= $${queryParams.length}`;
    }
  } else if (options.maximum_price_per_night) {
    let maximum_price_dollars = options.maximum_price_per_night * 100;
    queryParams.push(maximum_price_dollars);
    if (queryParams.length === 1) {
      queryString += `WHERE cost_per_night <= $${queryParams.length}`;
    } else {
      queryString += `AND cost_per_night <= $${queryParams.length}`;
    }
  }
  if (options.minimum_rating) {
    let minimum_rating = options.minimum_rating;
    queryParams.push(minimum_rating);
    queryString += `AND rating >= $${queryParams.length}`;
    queryParams.push(limit);
    queryString += `
      GROUP BY properties.id
      ORDER BY cost_per_night
      LIMIT $${queryParams.length};
    `;
  } else {
      queryParams.push(limit);
      queryString += `
      GROUP BY properties.id
      ORDER BY cost_per_night
      LIMIT $${queryParams.length};
      `;
  }
  // 5
  console.log(queryString, queryParams);

  // 6
  return pool.query(queryString, queryParams).then((res) => res.rows);
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
