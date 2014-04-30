// Generated by CoffeeScript 1.7.1
(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  module.exports = function(robot) {
    var getAmbiguousUserText;
    if (process.env.HUBOT_AUTH_ADMIN != null) {
      robot.logger.warning('The HUBOT_AUTH_ADMIN environment variable is set not going to load roles.coffee, you should delete it');
      return;
    }
    getAmbiguousUserText = function(users) {
      var user;
      return "Be more specific, I know " + users.length + " people named like that: " + (((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = users.length; _i < _len; _i++) {
          user = users[_i];
          _results.push(user.name);
        }
        return _results;
      })()).join(", "));
    };
    robot.respond(/who is @?([\w .\-]+)\?*$/i, function(msg) {
      var joiner, name, user, users;
      joiner = ', ';
      name = msg.match[1].trim();
      if (name === "you") {
        return msg.send("Who ain't I?");
      } else if (name === robot.name) {
        return msg.send("The best.");
      } else {
        users = robot.brain.usersForFuzzyName(name);
        if (users.length === 1) {
          user = users[0];
          user.roles = user.roles || [];
          if (user.roles.length > 0) {
            if (user.roles.join('').search(',') > -1) {
              joiner = '; ';
            }
            return msg.send("" + name + " is " + (user.roles.join(joiner)) + ".");
          } else {
            return msg.send("" + name + " is nothing to me.");
          }
        } else if (users.length > 1) {
          return msg.send(getAmbiguousUserText(users));
        } else {
          return msg.send("" + name + "? Never heard of 'em");
        }
      }
    });
    robot.respond(/@?([\w .\-_]+) is (["'\w: \-_]+)[.!]*$/i, function(msg) {
      var name, newRole, user, users;
      name = msg.match[1].trim();
      newRole = msg.match[2].trim();
      if (name !== '' && name !== 'who' && name !== 'what' && name !== 'where' && name !== 'when' && name !== 'why') {
        if (!newRole.match(/^not\s+/i)) {
          users = robot.brain.usersForFuzzyName(name);
          if (users.length === 1) {
            user = users[0];
            user.roles = user.roles || [];
            if (__indexOf.call(user.roles, newRole) >= 0) {
              return msg.send("I know");
            } else {
              user.roles.push(newRole);
              if (name.toLowerCase() === robot.name.toLowerCase()) {
                return msg.send("Ok, I am " + newRole + ".");
              } else {
                return msg.send("Ok, " + name + " is " + newRole + ".");
              }
            }
          } else if (users.length > 1) {
            return msg.send(getAmbiguousUserText(users));
          } else {
            return msg.send("I don't know anything about " + name + ".");
          }
        }
      }
    });
    return robot.respond(/@?([\w .\-_]+) is not (["'\w: \-_]+)[.!]*$/i, function(msg) {
      var name, newRole, role, user, users;
      name = msg.match[1].trim();
      newRole = msg.match[2].trim();
      if (name !== '' && name !== 'who' && name !== 'what' && name !== 'where' && name !== 'when' && name !== 'why') {
        users = robot.brain.usersForFuzzyName(name);
        if (users.length === 1) {
          user = users[0];
          user.roles = user.roles || [];
          if (__indexOf.call(user.roles, newRole) < 0) {
            return msg.send("I know.");
          } else {
            user.roles = (function() {
              var _i, _len, _ref, _results;
              _ref = user.roles;
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                role = _ref[_i];
                if (role !== newRole) {
                  _results.push(role);
                }
              }
              return _results;
            })();
            return msg.send("Ok, " + name + " is no longer " + newRole + ".");
          }
        } else if (users.length > 1) {
          return msg.send(getAmbiguousUserText(users));
        } else {
          return msg.send("I don't know anything about " + name + ".");
        }
      }
    });
  };

}).call(this);
