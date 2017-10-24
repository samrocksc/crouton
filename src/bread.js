const knex = require('../knex');
const debug = require('debug')('bread');

const { throwDatabaseError, throwNotFound } = require('../lib/errors');

module.exports = {
  browse(table, fields, filter, dbApi = knex) {
    return dbApi(table)
      .where(filter)
      .select(fields)
      .catch((err) => {
        debug(err);
        return throwDatabaseError(err);
      })
      .then((rows) => {
        return rows;
      });
  },
  read(table, fields, filter, dbApi = knex) {
    return dbApi(table)
      .where(filter)
      .select(fields)
      .catch((err) => {
        debug(err);
        return throwDatabaseError(err);
      })
      .then((rows) => {
        if (rows.length === 1) {
          return rows[0];
        }
        return throwNotFound();
      });
  },
  add(table, fields, data, dbApi = knex) {
    return dbApi(table)
      .returning(fields)
      .insert(data)
      .catch((err) => {
        debug(err);
        return throwDatabaseError(err);
      })
      .then(([row]) => {
        return row;
      });
  },
  edit(table, fields, data, filter, dbApi = knex) {
    return dbApi(table)
      .where(filter)
      .returning(fields)
      .update(data)
      .catch((err) => {
        debug(err);
        return throwDatabaseError(err);
      })
      .then(([row]) => {
        if (row) {
          return row;
        }
        return throwNotFound();
      });
  },
  del(table, filter, dbApi = knex) {
    return dbApi(table)
      .where(filter)
      .del()
      .catch((err) => {
        debug(err);
        return throwDatabaseError(err);
      })
      .then((row) => {
        if (row === 0) {
          return throwNotFound();
        }
        return row;
      });
  },
  raw(sql, options, dbApi = knex) {
    return dbApi.raw(sql, options)
      .catch((err) => {
        debug(err);
        return throwDatabaseError(err);
      })
      .then(res => res.rows);
  },
  rawOne(sql, options, dbApi = knex) {
    return dbApi.raw(sql, options)
      .catch((err) => {
        debug(err);
        return throwDatabaseError(err);
      })
      .then((res) => {
        if (res.rows.length === 1) {
          return res.rows[0];
        }
        return throwNotFound();
      });
  }
};
