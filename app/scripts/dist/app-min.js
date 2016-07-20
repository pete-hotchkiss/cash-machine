"use strict";angular.module("cashPointApp",[]).value("version","v1.0.1").controller("cashPointController",function(t,n){n.get("/data/float.json").then(function(n){t.float=n.data.float,t.updateblance()}),t.locale="en-gb",t.withdrawlpriortiy="least",t.prioritydenomination=2e3,t.currentbalance=0,t.transactions=[],t.displayvalue=0,t.amount=0,t.message={},t.reset=function(){t.displayvalue=t.formatAsCurrency(0),t.amount=0,t.message={}},t.buildvalue=function(n){t.amount=0==t.amount?n:t.amount.toString()+n,t.displayvalue=t.formatAsCurrency(t.amount)},t.submit=function(n){try{t.withdraw(t.amount)}catch(n){t.message={type:"warning",message:n.message}}},t.changeWithdrawlPriority=function(n){switch(n){case"d":case"s":t.withdrawlpriortiy="d"===n?"denomination":"least";break;default:throw new Error("Invalid priority type requested")}return t.withdrawlpriortiy},t.balance=function(){return t.formatAsCurrency(t.currentbalance)},t.checkAvailableBalance=function(n){return t.currentbalance>n},t.getAviailableDenominations=function(n){return jslinq(t.float).select(function(t){return n?{denomination:t.denomination,type:t.type,amount:t.amount}:t.denomination}).toList()},t.withdraw=function(n){if(isNaN(n))throw new Error("Sorry - only numbers can be withdrawn");if(t.checkAvailableBalance(n)){var e=t.getRequestedWithdrawl(n),r=t.getWithdrawlCountsTypeCounts(n);t.updateFloat(e);var a={timestamp:Date.now(),amount:t.formatAsCurrency(n),balance:t.formatAsCurrency(t.currentbalance),totalcount:e.length,withdrawldetail:t.getRequestedWithdrawlCounts(e),breakdown:r,simple:e};return t.transactions.unshift(a),t.reset(),t.message={type:"sucsess",message:"Sucsessful Transaction"},a}throw new Error("Sorry - Insuficent funds")},t.getRequestedWithdrawl=function(n,e){for(var r=t.getAviailableDenominations(!0),a="least"===t.withdrawlpriortiy?r.length-1:t.getPriorityIndex(t.prioritydenomination),o=[],i=1;n>=r[0].denomination;)if(n>=r[a].denomination&&t.float[a].amount>=i)n-=r[a].denomination,o.push("type"!==e?r[a].denomination:{type:r[a].type,value:r[a].denomination}),i++;else{if(i=1,1===r[a].denomination&&0!==n)throw new Error("Sorry - we cant provide that withdrawl amount. The float is "+t.formatAsCurrency(n)+" short");a--}return o},t.getRequestedWithdrawlCounts=function(t){return jslinq(t).groupBy(function(t){return t}).toList()},t.getWithdrawlCountsTypeCounts=function(n){var e=jslinq(t.getRequestedWithdrawl(n,"type")).groupBy(function(t){return t.type}).toList();return{coins:Number(jslinq(e).where(function(t){return"coin"===t.key}).select(function(t){return t.count}).singleOrDefault()),cointotal:t.getDenominationTypeSubTotal(e,"coin"),notes:Number(jslinq(e).where(function(t){return"note"===t.key}).select(function(t){return t.count}).singleOrDefault()),notetotal:t.getDenominationTypeSubTotal(e,"note")}},t.getDenominationTypeSubTotal=function(t,n){return jslinq(t).where(function(t){return t.key===n}).select(function(t){return jslinq(t.elements).sum(function(t){return t.value})}).singleOrDefault()},t.updateFloat=function(n){for(var e in n){var r=jslinq(t.float).where(function(t){return t.denomination===n[e]}).toList()[0];r.amount--}return t.updateblance(),t.float},t.updateblance=function(){t.currentbalance=jslinq(t.float).sum(function(t){return t.amount*t.denomination})},t.testfunction=function(t){return 100*t},t.formatAsCurrency=function(n){return numeral.language(t.locale),numeral(n).divide(100).format("$0,0.00")},t.getPriorityIndex=function(n){var e=t.getAviailableDenominations(!1).indexOf(n);return t.float[e].amount>1?e:t.float.length-1}});