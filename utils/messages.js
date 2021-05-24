const moment =require('moment');

function formatMessage(username,text,color = "#000"){
    return {
        username,
        text,
        time: moment().format('h:mm a'),
        color:color
    }
}

module.exports=formatMessage;