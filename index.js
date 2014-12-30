module.exports = new NscDynamoDBFilter();

function NscDynamoDBFilter() {
    var self = this;
    var AWS = require('aws-sdk');
    var dynamodb = null;

    self.config = function (cfg) {
        try {
            self.dynamodb = new AWS.DynamoDB(cfg);
        } catch (e) {
            throw new Error('Could not configure DynamoDB: ', e);

        }
    }

    self.filter = function (item) {
        if (!self.config) {
            throw new Error("Please configure dynamodb filter");
        }

        // build a Dynamo item from `item`
        var awsItem = {};
        var keys = Object.keys(item);
        for (var i = 0; i < keys.length; i++) {
            // ignore keys starting with two underscores
            if (keys[i].lastIndexOf('__', 0)) {
                awsItem[keys[i]] = {
                    S: item[keys[i]]
                }
            }
        }

        if (!awsItem.id) {
            awsItem.id = {
                S: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                })
            }
        }

        self.dynamodb.putItem({ Item: awsItem }, function (err, data) {
            if (err) {
                console.log("Could not insert item into DynamoDB:\n" + err)
            }
            return item;
        });
    }
}