(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var _ = Package.underscore._;
var LocalCollection = Package.minimongo.LocalCollection;
var Minimongo = Package.minimongo.Minimongo;
var Random = Package.random.Random;

/* Package-scope variables */
var Security, rulesByCollection, addFuncForAll, ensureCreated, ensureDefaultAllow, ensureSecureDeny;

(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/ongoworks:security/security-util.js                                                            //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
/* global _, rulesByCollection:true, addFuncForAll:true, ensureCreated:true, ensureDefaultAllow:true */    // 1
                                                                                                           // 2
rulesByCollection = {};                                                                                    // 3
                                                                                                           // 4
var created = {                                                                                            // 5
  allow: {                                                                                                 // 6
    insert: {},                                                                                            // 7
    update: {},                                                                                            // 8
    remove: {},                                                                                            // 9
    download: {} // for use with CollectionFS packages                                                     // 10
  },                                                                                                       // 11
  deny: {                                                                                                  // 12
    insert: {},                                                                                            // 13
    update: {},                                                                                            // 14
    remove: {},                                                                                            // 15
    download: {} // for use with CollectionFS packages                                                     // 16
  }                                                                                                        // 17
};                                                                                                         // 18
                                                                                                           // 19
/**                                                                                                        // 20
 * Adds the given function as an allow or deny function for all specified collections and types.           // 21
 * @param {Array(Mongo.Collection)} collections Array of Mongo.Collection instances                        // 22
 * @param {String}                  allowOrDeny "allow" or "deny"                                          // 23
 * @param {Array(String)}           types       Array of types ("insert", "update", "remove")              // 24
 * @param {Array(String)|null}      fetch       `fetch` property to use                                    // 25
 * @param {Function}                func        The function                                               // 26
 */                                                                                                        // 27
addFuncForAll = function addFuncForAll(collections, allowOrDeny, types, fetch, func) {                     // 28
  // We always disable transformation, but we transform for specific                                       // 29
  // rules upon running our deny function if requested.                                                    // 30
  var rules = {transform: null};                                                                           // 31
  if (_.isArray(fetch)) {                                                                                  // 32
    rules.fetch = fetch;                                                                                   // 33
  }                                                                                                        // 34
  _.each(types, function (t) {                                                                             // 35
    rules[t] = func;                                                                                       // 36
  });                                                                                                      // 37
  _.each(collections, function (c) {                                                                       // 38
    c[allowOrDeny](rules);                                                                                 // 39
  });                                                                                                      // 40
};                                                                                                         // 41
                                                                                                           // 42
/**                                                                                                        // 43
 * Creates the allow or deny function for the given collections if not already created. This ensures that this package only ever creates up to one allow and one deny per collection.
 * @param   {String}                  allowOrDeny "allow" or "deny"                                        // 45
 * @param   {Array(Mongo.Collection)} collections An array of collections                                  // 46
 * @param   {Array(String)}           types       An array of types ("insert", "update", "remove")         // 47
 * @param   {Array(String)|null}      fetch       `fetch` property to use                                  // 48
 * @param   {Function}                func        The function                                             // 49
 */                                                                                                        // 50
ensureCreated = function ensureCreated(allowOrDeny, collections, types, fetch, func) {                     // 51
  _.each(types, function (t) {                                                                             // 52
    collections = _.reject(collections, function (c) {                                                     // 53
      return _.has(created[allowOrDeny][t], c._name);                                                      // 54
    });                                                                                                    // 55
    addFuncForAll(collections, allowOrDeny, [t], null, func);                                              // 56
    // mark that we've defined function for collection-type combo                                          // 57
    _.each(collections, function (c) {                                                                     // 58
      created[allowOrDeny][t][c._name] = true;                                                             // 59
    });                                                                                                    // 60
  });                                                                                                      // 61
};                                                                                                         // 62
                                                                                                           // 63
/**                                                                                                        // 64
 * Sets up default allow functions for the collections and types.                                          // 65
 * @param   {Array(Mongo.Collection)} collections Array of Mongo.Collection instances                      // 66
 * @param   {Array(String)}           types       Array of types ("insert", "update", "remove")            // 67
 */                                                                                                        // 68
ensureDefaultAllow = function ensureDefaultAllow(collections, types) {                                     // 69
  ensureCreated("allow", collections, types, [], function () {                                             // 70
    return true;                                                                                           // 71
  });                                                                                                      // 72
};                                                                                                         // 73
                                                                                                           // 74
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/ongoworks:security/security-deny.js                                                            //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
/*                                                                                                         // 1
 * A single deny function runs all the deny functions registered by this package, allowing us to have      // 2
 * an OR relationship among multiple security rule chains.                                                 // 3
 */                                                                                                        // 4
                                                                                                           // 5
ensureSecureDeny = function ensureSecureDeny(collections, types) {                                         // 6
  _.each(types, function (t) {                                                                             // 7
    _.each(collections, function (collection) {                                                            // 8
      var collectionName = collection._name;                                                               // 9
      ensureCreated("deny", [collection], [t], null, function () {                                         // 10
        var args = _.toArray(arguments);                                                                   // 11
        var rules = rulesByCollection[collectionName] || [];                                               // 12
                                                                                                           // 13
        // select only those rules that apply to this operation type                                       // 14
        rules = _.select(rules, function (rule) {                                                          // 15
          return _.contains(rule._types, t);                                                               // 16
        });                                                                                                // 17
                                                                                                           // 18
        // Loop through all defined rules for this collection. There is an OR relationship among           // 19
        // all rules for the collection, so if any do NOT return true, we allow.                           // 20
        return _.every(rules, function (rule) {                                                            // 21
          return rule.deny(t, collection, args);                                                           // 22
        });                                                                                                // 23
      });                                                                                                  // 24
    });                                                                                                    // 25
  });                                                                                                      // 26
};                                                                                                         // 27
                                                                                                           // 28
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/ongoworks:security/security-api.js                                                             //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
// The `Security` object is exported and provides the package API                                          // 1
Security = {                                                                                               // 2
  Rule: function SecurityRuleConstructor(types) {                                                          // 3
    var self = this;                                                                                       // 4
                                                                                                           // 5
    if (!_.isArray(types)) {                                                                               // 6
      types = [types];                                                                                     // 7
    }                                                                                                      // 8
    self._types = types;                                                                                   // 9
    self._restrictions = [];                                                                               // 10
  },                                                                                                       // 11
  // the starting point of the chain                                                                       // 12
  permit: function permit(types) {                                                                         // 13
    return new Security.Rule(types);                                                                       // 14
  },                                                                                                       // 15
  defineMethod: function securityDefineMethod(name, definition) {                                          // 16
    // Check whether a rule with the given name already exists; can't overwrite                            // 17
    if (Security.Rule.prototype[name]) {                                                                   // 18
      throw new Error('A security method with the name "' + name + '" has already been defined');          // 19
    }                                                                                                      // 20
    // Make sure the definition argument is an object that has a `deny` property                           // 21
    if (!definition || !definition.deny) {                                                                 // 22
      throw new Error('Security.defineMethod requires a "deny" function');                                 // 23
    }                                                                                                      // 24
    // Wrap transform, if provided                                                                         // 25
    if (definition.transform) {                                                                            // 26
      definition.transform = LocalCollection.wrapTransform(definition.transform);                          // 27
    }                                                                                                      // 28
    Security.Rule.prototype[name] = function (arg) {                                                       // 29
      var self = this;                                                                                     // 30
      self._restrictions.push({                                                                            // 31
        definition: definition,                                                                            // 32
        arg: arg                                                                                           // 33
      });                                                                                                  // 34
      return self;                                                                                         // 35
    };                                                                                                     // 36
  }                                                                                                        // 37
};                                                                                                         // 38
                                                                                                           // 39
// Security.Rule prototypes                                                                                // 40
Security.Rule.prototype.collections = function (collections) {                                             // 41
  var self = this;                                                                                         // 42
  // Make sure the `collections` argument is either a `Mongo.Collection` instance or                       // 43
  // an array of them. If it's a single collection, convert it to a one-item array.                        // 44
  if (!_.isArray(collections)) {                                                                           // 45
    if (collections instanceof Mongo.Collection) {                                                         // 46
      collections = [collections];                                                                         // 47
    } else {                                                                                               // 48
      throw new Error("The collections argument must be a Mongo.Collection instance or an array of them"); // 49
    }                                                                                                      // 50
  }                                                                                                        // 51
                                                                                                           // 52
  self._collections = collections;                                                                         // 53
                                                                                                           // 54
  // Keep list keyed by collection name                                                                    // 55
  _.each(collections, function (collection) {                                                              // 56
    var n = collection._name;                                                                              // 57
    rulesByCollection[n] = rulesByCollection[n] || [];                                                     // 58
    rulesByCollection[n].push(self);                                                                       // 59
  });                                                                                                      // 60
                                                                                                           // 61
  return self;                                                                                             // 62
};                                                                                                         // 63
                                                                                                           // 64
Security.Rule.prototype.apply = function () {                                                              // 65
  var self = this;                                                                                         // 66
                                                                                                           // 67
  if (!self._collections || !self._types) {                                                                // 68
    throw new Error("At a minimum, you must call permit and collections methods for a security rule.");    // 69
  }                                                                                                        // 70
                                                                                                           // 71
  // If we haven't yet done so, set up a default, permissive `allow` function for all of                   // 72
  // the given collections and types. We control all security through `deny` functions only, but           // 73
  // there must first be at least one `allow` function for each collection or all writes                   // 74
  // will be denied.                                                                                       // 75
  ensureDefaultAllow(self._collections, self._types);                                                      // 76
                                                                                                           // 77
  // We need a combined `fetch` array. The `fetch` is optional and can be either an array                  // 78
  // or a function that takes the argument passed to the restriction method and returns an array.          // 79
  // TODO for now we can't set fetch accurately; maybe need to adjust API so that we "apply" only          // 80
  // after we've defined all rules                                                                         // 81
  //var fetch = [];                                                                                        // 82
  //_.each(self._restrictions, function (restriction) {                                                    // 83
  //  if (_.isArray(restriction.definition.fetch)) {                                                       // 84
  //    fetch = fetch.concat(restriction.definition.fetch);                                                // 85
  //  } else if (typeof restriction.definition.fetch === "function") {                                     // 86
  //    fetch = fetch.concat(restriction.definition.fetch(restriction.arg));                               // 87
  //  }                                                                                                    // 88
  //});                                                                                                    // 89
                                                                                                           // 90
  ensureSecureDeny(self._collections, self._types);                                                        // 91
                                                                                                           // 92
};                                                                                                         // 93
                                                                                                           // 94
Security.Rule.prototype.deny = function (type, collection, args) {                                         // 95
  var self = this;                                                                                         // 96
  // Loop through all defined restrictions. Restrictions are additive for this chained                     // 97
  // rule, so if any deny function returns true, this function should return true.                         // 98
  return _.any(self._restrictions, function (restriction) {                                                // 99
    var doc, transform = restriction.definition.transform;                                                 // 100
                                                                                                           // 101
    // If transform is a function, apply that                                                              // 102
    if (typeof transform === 'function') {                                                                 // 103
      if (type === 'insert') {                                                                             // 104
        doc = EJSON.clone(args[1]);                                                                        // 105
        // The wrapped transform requires an _id, but we                                                   // 106
        // don't have access to the generatedId from Meteor API,                                           // 107
        // so we'll fudge one and then remove it.                                                          // 108
        doc._id = Random.id();                                                                             // 109
      } else {                                                                                             // 110
        doc = args[1];                                                                                     // 111
      }                                                                                                    // 112
      args[1] = transform(doc);                                                                            // 113
      if (type === 'insert') {                                                                             // 114
        delete args[1]._id;                                                                                // 115
      }                                                                                                    // 116
    }                                                                                                      // 117
                                                                                                           // 118
    // If not transform: null, apply the collection transform                                              // 119
    else if (transform !== null && typeof collection._transform === 'function') {                          // 120
      if (type === 'insert') {                                                                             // 121
        doc = EJSON.clone(args[1]);                                                                        // 122
        // The wrapped transform requires an _id, but we                                                   // 123
        // don't have access to the generatedId from Meteor API,                                           // 124
        // so we'll fudge one and then remove it.                                                          // 125
        doc._id = Random.id();                                                                             // 126
      } else {                                                                                             // 127
        doc = args[1];                                                                                     // 128
      }                                                                                                    // 129
      args[1] = collection._transform(doc);                                                                // 130
      if (type === 'insert') {                                                                             // 131
        delete args[1]._id;                                                                                // 132
      }                                                                                                    // 133
    }                                                                                                      // 134
                                                                                                           // 135
    return restriction.definition.deny.apply(this, [type, restriction.arg].concat(args));                  // 136
  });                                                                                                      // 137
};                                                                                                         // 138
                                                                                                           // 139
Mongo.Collection.prototype.permit = function (types) {                                                     // 140
  return Security.permit(types).collections(this);                                                         // 141
};                                                                                                         // 142
                                                                                                           // 143
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/ongoworks:security/security-rules.js                                                           //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
/*                                                                                                         // 1
 * This file defines built-in restriction methods                                                          // 2
 */                                                                                                        // 3
                                                                                                           // 4
/*                                                                                                         // 5
 * No one                                                                                                  // 6
 */                                                                                                        // 7
                                                                                                           // 8
Security.defineMethod("never", {                                                                           // 9
  fetch: [],                                                                                               // 10
  transform: null,                                                                                         // 11
  deny: function () {                                                                                      // 12
    return true;                                                                                           // 13
  }                                                                                                        // 14
});                                                                                                        // 15
                                                                                                           // 16
/*                                                                                                         // 17
 * Logged In                                                                                               // 18
 */                                                                                                        // 19
                                                                                                           // 20
Security.defineMethod("ifLoggedIn", {                                                                      // 21
  fetch: [],                                                                                               // 22
  transform: null,                                                                                         // 23
  deny: function (type, arg, userId) {                                                                     // 24
    return !userId;                                                                                        // 25
  }                                                                                                        // 26
});                                                                                                        // 27
                                                                                                           // 28
/*                                                                                                         // 29
 * Specific User ID                                                                                        // 30
 */                                                                                                        // 31
                                                                                                           // 32
Security.defineMethod("ifHasUserId", {                                                                     // 33
  fetch: [],                                                                                               // 34
  transform: null,                                                                                         // 35
  deny: function (type, arg, userId) {                                                                     // 36
    return userId !== arg;                                                                                 // 37
  }                                                                                                        // 38
});                                                                                                        // 39
                                                                                                           // 40
/*                                                                                                         // 41
 * Specific Roles                                                                                          // 42
 */                                                                                                        // 43
                                                                                                           // 44
/*                                                                                                         // 45
 * alanning:roles support                                                                                  // 46
 */                                                                                                        // 47
if (Package && Package["alanning:roles"]) {                                                                // 48
                                                                                                           // 49
  var Roles = Package["alanning:roles"].Roles;                                                             // 50
                                                                                                           // 51
  Security.defineMethod("ifHasRole", {                                                                     // 52
    fetch: [],                                                                                             // 53
    transform: null,                                                                                       // 54
    deny: function (type, arg, userId) {                                                                   // 55
      if (!arg) {                                                                                          // 56
        throw new Error('ifHasRole security rule method requires an argument');                            // 57
      }                                                                                                    // 58
      if (arg.role) {                                                                                      // 59
        return !Roles.userIsInRole(userId, arg.role, arg.group);                                           // 60
      } else {                                                                                             // 61
        return !Roles.userIsInRole(userId, arg);                                                           // 62
      }                                                                                                    // 63
    }                                                                                                      // 64
  });                                                                                                      // 65
                                                                                                           // 66
}                                                                                                          // 67
                                                                                                           // 68
/*                                                                                                         // 69
 * nicolaslopezj:roles support                                                                             // 70
 * Note: doesn't support groups                                                                            // 71
 */                                                                                                        // 72
if (Package && Package["nicolaslopezj:roles"]) {                                                           // 73
                                                                                                           // 74
  var Roles = Package["nicolaslopezj:roles"].Roles;                                                        // 75
                                                                                                           // 76
  Security.defineMethod("ifHasRole", {                                                                     // 77
    fetch: [],                                                                                             // 78
    transform: null,                                                                                       // 79
    deny: function (type, arg, userId) {                                                                   // 80
      if (!arg) {                                                                                          // 81
        throw new Error('ifHasRole security rule method requires an argument');                            // 82
      }                                                                                                    // 83
      return !Roles.userHasRole(userId, arg);                                                              // 84
    }                                                                                                      // 85
  });                                                                                                      // 86
                                                                                                           // 87
}                                                                                                          // 88
                                                                                                           // 89
/*                                                                                                         // 90
 * Specific Properties                                                                                     // 91
 */                                                                                                        // 92
                                                                                                           // 93
Security.defineMethod("onlyProps", {                                                                       // 94
  fetch: [],                                                                                               // 95
  transform: null,                                                                                         // 96
  deny: function (type, arg, userId, doc, fieldNames) {                                                    // 97
    if (!_.isArray(arg)) {                                                                                 // 98
      arg = [arg];                                                                                         // 99
    }                                                                                                      // 100
                                                                                                           // 101
    fieldNames = fieldNames || _.keys(doc);                                                                // 102
                                                                                                           // 103
    return !_.every(fieldNames, function (fieldName) {                                                     // 104
      return _.contains(arg, fieldName);                                                                   // 105
    });                                                                                                    // 106
  }                                                                                                        // 107
});                                                                                                        // 108
                                                                                                           // 109
Security.defineMethod("exceptProps", {                                                                     // 110
  fetch: [],                                                                                               // 111
  transform: null,                                                                                         // 112
  deny: function (type, arg, userId, doc, fieldNames) {                                                    // 113
    if (!_.isArray(arg)) {                                                                                 // 114
      arg = [arg];                                                                                         // 115
    }                                                                                                      // 116
                                                                                                           // 117
    fieldNames = fieldNames || _.keys(doc);                                                                // 118
                                                                                                           // 119
    return _.any(fieldNames, function (fieldName) {                                                        // 120
      return _.contains(arg, fieldName);                                                                   // 121
    });                                                                                                    // 122
  }                                                                                                        // 123
});                                                                                                        // 124
                                                                                                           // 125
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['ongoworks:security'] = {
  Security: Security
};

})();

//# sourceMappingURL=ongoworks_security.js.map
