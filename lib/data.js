/**
 * Library for storing and editing data
 *
 */

// Dependencies
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

const config = require('../config');

const url = config.dbConnectionUrl;
const collection = config.dbCollection;

// Container for the module (to be exported)
const lib = {
    client: null,
    db: null
};

lib.connect = async function () {
    if (lib.db === null) {
        try {
            lib.client = await MongoClient.connect(url, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });

            console.log("Connected correctly to MongoClient");

            lib.db = lib.client.db(collection);

            return;
        } catch (error) {
            throw new Error(error.stack);
        }
    } else {
        return;
    }
};

lib.create = async function (collection, data) {
    try {
        await lib.connect();

        let col = await lib.db.collection(collection);
        let res = await col.insertOne(data);

        return res.ops[0];

    } catch (error) {
        throw new Error(error.stack);
    }
};

lib.update = async function (collection, id, data) {
    try {
        await lib.connect();

        let col = await lib.db.collection(collection);
        let filter = { _id: new ObjectId(id) };
        let res = await col.updateOne(filter, {$set: data});

        return res;
    } catch (error) {
        throw new Error(error.stack);
    }
};

lib.updateMany = async function (collection, filter, data) {
    try {
        await lib.connect();

        let col = await lib.db.collection(collection);
        let res = await col.updateOne(filter, {$set: data});

        return res;
    } catch (error) {
        throw new Error(error.stack);
    }
};

lib.delete = async function (collection, id) {
    try {
        await lib.connect();

        let col = await lib.db.collection(collection);
        let filter = { _id: new ObjectId(id) };

        await col.deleteOne(filter);

        return;
    } catch (error) {
        throw new Error(error.stack);
    }
};

lib.deleteMany = async function (collection, filter) {
    try {
        await lib.connect();

        const col = await lib.db.collection(collection);

        await col.deleteMany(filter);

        return;
    } catch (error) {
        throw new Error(error.stack);
    }
};

lib.list = async function (collection, filterObj = {}) {
    try {
        await lib.connect();

        let col = await lib.db.collection(collection);
        let res = await col.find(filterObj).toArray();

        return res;
    } catch (error) {
        throw new Error(error.stack);
    }
};

lib.read = async function (collection, obj) {
    try {
        await lib.connect();

        const col = await lib.db.collection(collection);
        const document = await col.findOne(obj);

        return document;
    } catch (error) {
        throw new Error(error.stack);
    }
};

module.exports = lib;
